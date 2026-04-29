import OrderForm from "../components/OrderForm";

export const metadata = {
  title: "Order a song — SONGIE",
  description: "Tell us the story. We'll make them a song in seven days.",
};

export default function OrderPage() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">
            <span className="logo-mark" />
            SONGIE
          </a>
          <div className="nav-links">
            <a href="/#library">Sample library</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faq">FAQ</a>
          </div>
          <a href="/#pricing" className="nav-cta">
            Pricing
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </nav>

      {/* ORDER HERO */}
      <section className="order-page-hero">
        <div className="container">
          <div className="order-page-head">
            <div>
              <div className="eyebrow">Start here</div>
              <h1 className="order-page-h1">Tell us<br /><em>everything.</em></h1>
            </div>
            <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.75 }}>Ten minutes. The more you share — names, memories, inside jokes, the thing they always say — the better the song.</p>
          </div>
          <OrderForm />
          <div style={{ marginTop: 32, textAlign: "center" }}>
          <div className="order-quick-facts" style={{ display: "inline-flex" }}>
            <div className="oqf">
              <span className="oqf-num">$79</span>
              <span className="oqf-label">base price</span>
            </div>
            <div className="oqf-divider" />
            <div className="oqf">
              <span className="oqf-num">7</span>
              <span className="oqf-label">day delivery</span>
            </div>
            <div className="oqf-divider" />
            <div className="oqf">
              <span className="oqf-num">1</span>
              <span className="oqf-label">revision included</span>
            </div>
          </div>
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
                SONGIE
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
            <span>© 2026 SONGIE · All rights reserved.</span>
            <span>Made with care · Delivered in 7 days</span>
          </div>
        </div>
      </footer>
    </>
  );
}
