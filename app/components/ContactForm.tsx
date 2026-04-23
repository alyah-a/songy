"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to backend / email service
    setSent(true);
  }

  if (sent) {
    return (
      <div className="contact-success">
        <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
        <h3>Message received.</h3>
        <p>We typically respond within four hours during business hours. Keep an eye on your inbox — we&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="cf-field">
        <label>Your name</label>
        <input
          type="text"
          name="name"
          placeholder="Jane Smith"
          value={form.name}
          onChange={handle}
          required
        />
      </div>
      <div className="cf-field">
        <label>Email address</label>
        <input
          type="email"
          name="email"
          placeholder="jane@yourcompany.com"
          value={form.email}
          onChange={handle}
          required
        />
      </div>
      <div className="cf-field">
        <label>Subject</label>
        <select name="subject" value={form.subject} onChange={handle} required>
          <option value="">Select a topic…</option>
          <option value="corporate">Corporate / brand inquiry</option>
          <option value="order">Question about an order</option>
          <option value="press">Press or media</option>
          <option value="collab">Collaboration</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div className="cf-field">
        <label>Message</label>
        <textarea
          name="message"
          placeholder="Tell us what you have in mind…"
          value={form.message}
          onChange={handle}
          required
        />
      </div>
      <button type="submit" className="contact-submit">
        Send message
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
