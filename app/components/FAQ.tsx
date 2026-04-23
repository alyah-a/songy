"use client";

import { useState } from "react";

const faqs = [
  {
    q: <>How <em>custom</em> is custom?</>,
    a: `Every song is built around the specifics you share — names, anecdotes, inside jokes, the weird things that only the two of you remember. No templates. No "insert name here" choruses. Our creative director reads every brief personally and shapes the song around the real story.`,
  },
  {
    q: <>What if we <em>don't love</em> the first draft?</>,
    a: `One round of revisions is included with every song. If after that round we still haven't nailed it, additional rounds are available at $20 each. In the rare case we can't find a direction that works, we'll refund in full within the first-draft window.`,
  },
  {
    q: <>What <em>style</em> of song will it be?</>,
    a: `That's entirely up to our creative director — and we think that's a feature, not a bug. We write the song that fits the story. If you have a strong reference or vibe in mind, mention it in your brief and we'll take it into account.`,
  },
  {
    q: <>How does <em>rush delivery</em> work?</>,
    a: `Add the 3-day turnaround at checkout for $49. We reserve capacity for rush bookings every week, but it's first-come-first-served. Holiday peaks (February, December) fill up 2–3 weeks ahead — book early.`,
  },
  {
    q: <>What's included in the <em>video add-on?</em></>,
    a: `You share your photos, short video clips, or both — we edit them together synced to the song. Great for sharing on group chats, playing at a party, or posting. Delivered as an MP4 along with your MP3.`,
  },
  {
    q: <>Can the recipient be, uh… <em>not here anymore?</em></>,
    a: `Yes. Memorial songs are some of the most meaningful things we make. We handle the intake carefully and gently. Many of these become family keepsakes that get played every year.`,
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-wall">
      {faqs.map((item, i) => (
        <div
          key={i}
          className={`faq-item${open === i ? " open" : ""}`}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="faq-q">
            <div className="q">{item.q}</div>
            <div className="plus">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
          <div className="faq-a">{item.a}</div>
        </div>
      ))}
    </div>
  );
}
