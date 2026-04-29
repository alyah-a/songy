"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSongRequest } from "@/app/actions/song-requests";
import { trackEvent } from "@/app/providers/PostHogProvider";
import * as Sentry from "@sentry/nextjs";

type Step = "details" | "story" | "confirm";

const MAX_NAME_RECORDING_BYTES = 2 * 1024 * 1024;
const MAX_RECORDING_SECONDS = 12;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function OrderForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingElapsed, setRecordingElapsed] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const [form, setForm] = useState({
    recipientName: "",
    relationship: "",
    occasion: "",
    story: "",
    email: "",
    addons: [] as string[],
    nameRecording: null as File | null,
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (recordingUrlRef.current) {
        URL.revokeObjectURL(recordingUrlRef.current);
      }
    };
  }, []);

  const setAudioPreview = (url: string | null) => {
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current);
    }
    recordingUrlRef.current = url;
    setRecordingUrl(url);
  };

  const stopNameRecording = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startNameRecording = async () => {
    setRecordingError("");

    if (
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setRecordingError("Recording is not supported in this browser. You can still upload an audio file.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? { mimeType: "audio/webm;codecs=opus" }
        : undefined;
      const recorder = new MediaRecorder(stream, options);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        if (!blob.size) {
          setRecordingError("We couldn't capture that recording. Please try again.");
          return;
        }

        if (blob.size > MAX_NAME_RECORDING_BYTES) {
          setRecordingError("That clip is a little too long. Please keep it under 12 seconds.");
          return;
        }

        const file = new File([blob], "name-pronunciation.webm", {
          type: blob.type,
        });
        setForm((current) => ({ ...current, nameRecording: file }));
        setAudioPreview(URL.createObjectURL(blob));
        trackEvent("name_pronunciation_recorded", { size: blob.size });
      };

      setRecordingElapsed(0);
      setIsRecording(true);
      recorder.start();

      const timerId = window.setInterval(() => {
        setRecordingElapsed((seconds) => {
          const next = seconds + 1;
          if (next >= MAX_RECORDING_SECONDS) {
            if (recordingTimerRef.current) {
              window.clearInterval(recordingTimerRef.current);
              recordingTimerRef.current = null;
            }
            if (mediaRecorderRef.current?.state === "recording") {
              mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
          }
          return next;
        });
      }, 1000);
      recordingTimerRef.current = timerId;
    } catch (error) {
      Sentry.captureException(error);
      setRecordingError("We couldn't access your microphone. You can still upload an audio file.");
      setIsRecording(false);
    }
  };

  const handleRecordingFile = (file: File | null) => {
    setRecordingError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("audio/")) {
      setRecordingError("Please choose an audio file.");
      return;
    }

    if (file.size > MAX_NAME_RECORDING_BYTES) {
      setRecordingError("Please choose a short audio clip under 2 MB.");
      return;
    }

    setForm({ ...form, nameRecording: file });
    setAudioPreview(URL.createObjectURL(file));
    trackEvent("name_pronunciation_uploaded", { size: file.size, type: file.type });
  };

  const clearNameRecording = () => {
    if (isRecording) {
      stopNameRecording();
    }
    setForm({ ...form, nameRecording: null });
    setAudioPreview(null);
    setRecordingElapsed(0);
    setRecordingError("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const toggleAddon = (addon: string) => {
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(addon)
        ? f.addons.filter((a) => a !== addon)
        : [...f.addons, addon],
    }));
    trackEvent("addon_toggled", { addon });
  };

  const basePrice = 79;
  const addonPrices: Record<string, number> = {
    rush: 49,
    video: 59,
  };
  const total =
    basePrice +
    form.addons.reduce((sum, a) => sum + (addonPrices[a] ?? 0), 0);

  // Determine product ID based on addons
  const getProductId = () => {
    if (form.addons.includes("rush") && form.addons.includes("video")) {
      return "song-rush-video";
    } else if (form.addons.includes("rush")) {
      return "song-rush";
    } else if (form.addons.includes("video")) {
      return "song-video";
    }
    return "song-standard";
  };

  const handleStepChange = (newStep: Step) => {
    setStep(newStep);
    trackEvent("order_step_changed", { step: newStep });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    trackEvent("order_submission_started", { total, addons: form.addons });

    try {
      const productId = getProductId();
      const nameRecordingUrl = form.nameRecording
        ? await fileToDataUrl(form.nameRecording)
        : undefined;
      
      const result = await createSongRequest({
        recipientName: form.recipientName,
        relationship: form.relationship,
        occasion: form.occasion,
        story: form.story,
        email: form.email,
        addons: form.addons,
        totalPriceCents: total * 100,
        productId,
        nameRecordingUrl,
      });

      if (result.success && result.orderId) {
        trackEvent("order_created", { orderId: result.orderId, productId });
        // Redirect to checkout page with order details
        router.push(`/order/checkout?orderId=${result.orderId}&productId=${productId}&total=${total * 100}`);
      } else {
        throw new Error(result.error || "Failed to create order");
      }
    } catch (error) {
      Sentry.captureException(error);
      trackEvent("order_submission_failed", { error: String(error) });
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form-wrap">
      <div className="order-steps">
        <div className={`ostep${step === "details" ? " active" : ""}`}>
          <span>01</span> The recipient
        </div>
        <div className="ostep-line" />
        <div className={`ostep${step === "story" ? " active" : ""}`}>
          <span>02</span> The story
        </div>
        <div className="ostep-line" />
        <div className={`ostep${step === "confirm" ? " active" : ""}`}>
          <span>03</span> Confirm
        </div>
      </div>

      {/* STEP 1 */}
      {step === "details" && (
        <div className="order-step-body">
          <div className="field-group">
            <label className="field-label">
              Recipient&apos;s name <span className="req">*</span>
            </label>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. Priya, Uncle Dave, Marcus"
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              Name pronunciation{" "}
              <span className="field-hint">optional — helps us nail it</span>
            </label>
            <div className="recorder-box">
              <div className="recorder-top">
                <div className="recorder-copy">
                  <div className="recorder-actions">
                    <button
                      type="button"
                      className={`record-btn${isRecording ? " recording" : ""}`}
                      onClick={isRecording ? stopNameRecording : startNameRecording}
                    >
                      <span aria-hidden="true">🎙</span>
                      {isRecording ? "Stop recording" : "Record in browser"}
                    </button>
                    <button
                      type="button"
                      className="upload-audio-btn"
                      onClick={() => fileRef.current?.click()}
                    >
                      Upload audio
                    </button>
                  </div>

                  <div className="recording-meta">
                    Say their name once or twice. Max {MAX_RECORDING_SECONDS} seconds.
                    {isRecording ? <strong>{recordingElapsed}s</strong> : null}
                  </div>
                </div>
              </div>

              {recordingUrl ? (
                <div className="audio-preview">
                  <audio controls src={recordingUrl} />
                  <button type="button" onClick={clearNameRecording}>
                    Remove
                  </button>
                </div>
              ) : null}

              {recordingError ? (
                <p className="recording-error">{recordingError}</p>
              ) : null}

              {form.nameRecording && !recordingUrl ? (
                <span className="file-chosen">{form.nameRecording.name}</span>
              ) : null}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              onChange={(e) => handleRecordingFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              Who are you? <span className="req">*</span>
            </label>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. Her daughter, his best friend, their team at work"
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              What&apos;s the occasion? <span className="req">*</span>
            </label>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. 60th birthday, retirement, just because"
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            />
          </div>

          <button
            className="btn-flame"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={!form.recipientName || !form.relationship || !form.occasion}
            onClick={() => handleStepChange("story")}
          >
            Next — tell the story
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === "story" && (
        <div className="order-step-body">
          <div className="field-group">
            <label className="field-label">
              Share memories, inside jokes, funny stories <span className="req">*</span>
            </label>
            <p className="field-subtext">
              The more specific the better — the more detail you give us, the more personal the song. Don&apos;t edit yourself.
            </p>
            <textarea
              className="field-textarea"
              placeholder={`e.g. She always burns toast but pretends she didn't. She moved to a new city at 40 and started over. Her laugh is the loudest in every room. She cried at a dog food commercial once and we never let her forget it…`}
              rows={8}
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Your email <span className="req">*</span></label>
            <input
              className="field-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-nav">
            <button className="btn-ghost" onClick={() => handleStepChange("details")}>← Back</button>
            <button
              className="btn-flame"
              disabled={!form.story || !form.email}
              onClick={() => handleStepChange("confirm")}
            >
              Review order
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === "confirm" && (
        <div className="order-step-body">
          <div className="confirm-summary">
            <div className="confirm-row">
              <span className="cr-label">For</span>
              <span className="cr-value">{form.recipientName}</span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">From</span>
              <span className="cr-value">{form.relationship}</span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">Occasion</span>
              <span className="cr-value">{form.occasion}</span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">Delivery to</span>
              <span className="cr-value">{form.email}</span>
            </div>
          </div>

          <div className="field-group" style={{ marginTop: 24 }}>
            <label className="field-label">Add-ons</label>
            <div className="addon-checks">
              <label className={`addon-check${form.addons.includes("rush") ? " checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.addons.includes("rush")}
                  onChange={() => toggleAddon("rush")}
                />
                <span className="addon-check-box" />
                <span className="addon-check-label">24-hour rush delivery</span>
                <span className="addon-check-price">+$49</span>
              </label>
              <label className={`addon-check${form.addons.includes("video") ? " checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.addons.includes("video")}
                  onChange={() => toggleAddon("video")}
                />
                <span className="addon-check-box" />
                <span className="addon-check-label">Video with photos/clips</span>
                <span className="addon-check-price">+$59</span>
              </label>
            </div>
          </div>

          <div className="order-total">
            <span className="ot-label">Total</span>
            <span className="ot-price">${total} USD</span>
          </div>
          <p className="ot-note">Extra revisions billed at $20 each if needed after the included round.</p>

          <div className="form-nav">
            <button className="btn-ghost" onClick={() => handleStepChange("story")} disabled={isSubmitting}>← Back</button>
            <button
              className="btn-flame"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Continue to payment`}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
