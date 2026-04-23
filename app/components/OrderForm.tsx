"use client";

import { useState, useRef } from "react";

type Step = "details" | "story" | "confirm";

export default function OrderForm() {
  const [step, setStep] = useState<Step>("details");
  const [submitted, setSubmitted] = useState(false);
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

  const toggleAddon = (addon: string) => {
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(addon)
        ? f.addons.filter((a) => a !== addon)
        : [...f.addons, addon],
    }));
  };

  const basePrice = 79;
  const addonPrices: Record<string, number> = {
    rush: 49,
    video: 59,
  };
  const total =
    basePrice +
    form.addons.reduce((sum, a) => sum + (addonPrices[a] ?? 0), 0);

  if (submitted) {
    return (
      <div className="order-success">
        <div className="success-icon">♪</div>
        <h3>We&apos;ve got the story.</h3>
        <p>Check your inbox — we&apos;ll confirm your order within a few hours and kick off the brief. Your song is on its way.</p>
      </div>
    );
  }

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
            <div
              className="file-drop"
              onClick={() => fileRef.current?.click()}
            >
              {form.nameRecording ? (
                <span className="file-chosen">
                  ✓ {form.nameRecording.name}
                </span>
              ) : (
                <>
                  <span className="file-icon">🎙</span>
                  Upload a voice note saying their name
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*,video/*"
              style={{ display: "none" }}
              onChange={(e) =>
                setForm({ ...form, nameRecording: e.target.files?.[0] ?? null })
              }
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
            onClick={() => setStep("story")}
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
            <button className="btn-ghost" onClick={() => setStep("details")}>← Back</button>
            <button
              className="btn-flame"
              disabled={!form.story || !form.email}
              onClick={() => setStep("confirm")}
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
                <span className="addon-check-label">3-day turnaround</span>
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
            <button className="btn-ghost" onClick={() => setStep("story")}>← Back</button>
            <button
              className="btn-flame"
              onClick={() => setSubmitted(true)}
            >
              Submit & pay ${total}
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
