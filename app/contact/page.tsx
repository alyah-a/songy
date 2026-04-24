import ContactForm from "../components/ContactForm";

export const metadata = {
  title: "Get in touch — Songee",
  description: "Corporate inquiries, brand partnerships, and general questions. We respond within four hours.",
};

export default function ContactPage() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">
            <span className="logo-mark" />
            SONGEE
          </a>
          <div className="nav-links">
            <a href="/#pricing">Pricing</a>
            <a href="/#library">Sample library</a>
            <a href="/order">Order</a>
            <a href="/#faq">FAQ</a>
          </div>
          <a href="/order" className="nav-cta">
            Start a song
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </nav>

      <section className="contact-page">
        <div className="container">
          <div className="contact-header">
            <div className="eyebrow">Get in touch</div>
            <h1>Let&apos;s make<br />something <em>together.</em></h1>
            <p>Whether you&apos;re a brand, agency, content creator, or just have a question — drop us a message. A real person responds within four hours.</p>
          </div>

          <div className="contact-form-solo">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="ft-top">
            <div className="ft-brand">
              <a href="/" className="logo" style={{ color: "var(--cream)" }}>
                <span className="logo-mark" />
                SONGEE
              </a>
              <p>Custom songs made for one person at a time. Toronto · est. MMXXVI.</p>
            </div>
            <div>
              <h4>Help</h4>
              <ul>
                <li><a href="/#faq">FAQ</a></li>
                <li><a href="mailto:hello@songy.studio">Email us</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/refund">Refunds</a></li>
              </ul>
            </div>
          </div>
          <div className="ft-bottom">
            <span>© 2026 Songy · All rights reserved.</span>
            <span>Made with care · Delivered in 7 days</span>
          </div>
        </div>
      </footer>
    </>
  );
}
