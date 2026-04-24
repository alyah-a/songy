import FAQ from "./components/FAQ";

export default function Home() {
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
            <a href="#pricing">Pricing</a>
            <a href="#library">Sample library</a>
            <a href="/order">Order</a>
            <a href="#faq">FAQ</a>
          </div>
          <a href="/order" className="nav-cta">
            Start a song
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="cassette-stage" aria-hidden="true">
          <div className="cassette">
            <div className="cass-body">
              <div className="cass-top-strip">
                <div className="cass-label">
                  <div className="mini">SIDE A · 03:12</div>
                  EVERY YELLOW DOOR
                </div>
                <div className="cass-bars">
                  <span /><span /><span /><span /><span />
                </div>
              </div>
              <span className="cass-screws tl" />
              <div className="cass-center">
                <div className="reel reel-l"><div className="teeth" /></div>
                <div className="reel reel-r"><div className="teeth" /></div>
              </div>
              <div className="cass-bottom">
                <span>SONGIE STUDIO</span>
                <span>C-60 · DOLBY B</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="hero-meta">
            <span><span className="dot" />Taking orders · 7-day turnaround</span>
            <span>EST. MMXXVI · TORONTO</span>
          </div>

          <h1 className="hero-headline">
            <span className="row">A SONG</span>
            <span className="row">MADE <em>for one</em></span>
            <span className="row"><span className="stamp">PERSON.</span></span>
          </h1>

          <p className="hero-sub">
            Tell us the story. We&apos;ll make them a song — original lyrics, their name in the chorus,{" "}
            <b>crafted by our creative director and delivered in seven days.</b>
          </p>

          <div className="hero-ctas">
            <a href="/order" className="btn-flame">
              Start a song · $79
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#library" className="btn-ghost">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Listen to samples
            </a>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {["BIRTHDAYS", "anniversaries", "WEDDINGS", "proposals", "RETIREMENTS", "roasts", "NEW BABIES", "graduations",
            "BIRTHDAYS", "anniversaries", "WEDDINGS", "proposals", "RETIREMENTS", "roasts", "NEW BABIES", "graduations"].map((word, i) => (
            <span key={i}>
              {i % 2 === 1 ? <em>{word}</em> : word}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <section className="blk" id="pricing">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="eyebrow">§ 01 · Pricing</div>
              <h2 className="big">One price.<br /><em>No surprises.</em></h2>
            </div>
            <p className="desc">An original song, written and produced for one person. Everything else is optional.</p>
          </div>

          <div className="pricing-simple">
            <div className="price-hero-block">
              <div className="price-hero-left">
                <div className="price-tag">
                  <span className="price-cu">$</span>
                  <span className="price-num">79</span>
                  <span className="price-period">USD</span>
                </div>
                <div className="price-desc">
                  <strong>Base song · 7-day delivery</strong>
                  <p>One original song crafted for one person. Original lyrics, studio production, MP3 + lyric sheet. One revision round included.</p>
                </div>
              </div>
              <a href="/order" className="btn-flame price-cta">
                Start your song
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="addons-label">
              <span className="eyebrow" style={{ marginBottom: 0 }}>Add-ons</span>
            </div>
            <div className="addons-simple">
              <div className="ao-s">
                <div className="ao-s-left">
                  <div className="ao-s-name">3-day turnaround</div>
                  <div className="ao-s-hint">Need it fast? We&apos;ll prioritize your song.</div>
                </div>
                <div className="ao-s-price">+$49</div>
              </div>
              <div className="ao-s">
                <div className="ao-s-left">
                  <div className="ao-s-name">Video with photos & clips</div>
                  <div className="ao-s-hint">We sync your song with photos or videos you provide.</div>
                </div>
                <div className="ao-s-price">+$59</div>
              </div>
              <div className="ao-s">
                <div className="ao-s-left">
                  <div className="ao-s-name">Extra revisions</div>
                  <div className="ao-s-hint">One round included. Additional rounds available if needed.</div>
                </div>
                <div className="ao-s-price">+$20<span className="ao-s-unit">/round</span></div>
              </div>
            </div>
          </div>

          {/* CORPORATE */}
          <div className="corporate-banner">
            <div className="corp-left">
              <div className="eyebrow" style={{ marginBottom: 12 }}>For brands, agencies & content creators</div>
              <h3 className="corp-h">Ordering songs<br />for your <em>audience?</em></h3>
              <p>If you&apos;re a brand, agency, or content creator who needs custom songs regularly — for campaigns, gifting programs, or your community — we offer volume pricing, dedicated turnarounds, and a direct line to our creative director. Let&apos;s build something together.</p>
            </div>
            <a href="/contact" className="corp-cta">
              Get in touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* VINYL SHOWCASE */}
      <section className="vinyl-block" id="library">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="eyebrow">§ 02 · Library</div>
              <h2 className="big">The <em>A-side.</em><br />Real songs.<br />Real people.</h2>
            </div>
            <p className="desc" style={{ color: "var(--cream)", opacity: 0.85 }}>
              Every track was written for someone specific — a birthday, a retirement, a random Tuesday. Press play on a few.
            </p>
          </div>

          <div className="vinyl-layout">
            <div className="vinyl-stage">
              <div className="sleeve">
                <div className="sl-top">SONGIE STUDIO<br />PRESENTS</div>
                <div className="sl-title">Every<br />Yellow<br />Door</div>
                <div className="sl-foot">
                  <span>FOR PRIYA · 30</span>
                  <span>SIDE A</span>
                </div>
              </div>
              <div className="record">
                <div className="label-disc">
                  <div>
                    <div className="lbl-title">SONGIE</div>
                    <div className="lbl-sub">SIDE A · 3:12</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vinyl-copy">
              <h3>Twelve tracks.<br /><em>All originals.</em></h3>
              <p>Each one commissioned by a real person for another real person. No covers. No templates. Every song starts with a brief and ends with something that could not have been made for anyone else.</p>
              <ul>
                {[
                  ["A1", "Every Yellow Door", "3:12"],
                  ["A2", "Thirty Years on Wednesday", "4:02"],
                  ["A3", "Big Dog Energy (Marcus, 40)", "2:48"],
                  ["A4", "Coffee & Kitchen Light", "3:18"],
                  ["A5", "Will You, Though", "3:04"],
                  ["A6", "Song for Rupert", "2:40"],
                ].map(([n, t, dur]) => (
                  <li key={n}>
                    <span className="n">{n}</span>
                    <span className="t">{t}</span>
                    <span className="dur">{dur}</span>
                  </li>
                ))}
              </ul>
              <a href="/order" className="btn-flame" style={{ marginTop: 20 }}>
                Commission yours
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testis">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="eyebrow" style={{ color: "var(--cream)" }}>§ 03 · Reactions</div>
              <h2 className="big" style={{ color: "var(--cream)" }}>They hit play.<br /><em>Then cried.</em><br />Then laughed.</h2>
            </div>
            <p className="desc" style={{ color: "var(--cream)", opacity: 0.85 }}>
              What actually happens when someone hears a song written just for them.
            </p>
          </div>

          <div className="testi-grid">
            {[
              {
                quote: '"Dad retired Friday. Saturday he played it for his whole crew at the bar. Grown men cried. Then they played it again. I\'ve never seen that before."',
                name: "Maya, Portland",
                meta: "RETIREMENT",
              },
              {
                quote: '"Roast song for my brother\'s 40th. He turned so red. The whole room lost it. Four group chats, still getting screenshots a week later."',
                name: "Devon, Austin",
                meta: "BIRTHDAY ROAST",
              },
              {
                quote: '"Twenty years. She hit play, read the lyric sheet, and we just sat there holding hands for a while. No words. That\'s the whole review."',
                name: "Rafael, Brooklyn",
                meta: "ANNIVERSARY",
              },
            ].map((t) => (
              <div className="testi" key={t.name}>
                <div className="stars">★★★★★</div>
                <p className="quote">{t.quote}</p>
                <div className="who">
                  <span className="name">{t.name}</span>
                  <span className="meta">{t.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="blk" id="faq">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="eyebrow">§ 04 · Questions</div>
              <h2 className="big">The <em>stuff</em><br />people ask.</h2>
            </div>
            <p className="desc">
              Can&apos;t find yours? Email{" "}
              <a href="mailto:hello@songy.studio">hello@songy.studio</a>{" "}
              — a real person answers within four hours.
            </p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <div className="container">
          <h2 className="big-h">WRITE<br />THE <em>song</em><br />YOU WISH<br />EXISTED.</h2>
          <p>A 10-minute brief. Seven days. One song that&apos;ll exist forever, just for them.</p>
          <a href="/order" className="btn-flame">
            Start a song · $79
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
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
              <h4>Studio</h4>
              <ul>
                <li><a href="#library">Sample library</a></li>
                <li><a href="/order">Order a song</a></li>
              </ul>
            </div>
            <div>
              <h4>Pricing</h4>
              <ul>
                <li><a href="#pricing">Base song · $79</a></li>
                <li><a href="#pricing">3-day rush · +$49</a></li>
                <li><a href="#pricing">Video · +$59</a></li>
                <li><a href="/contact">Corporate inquiry</a></li>
              </ul>
            </div>
            <div>
              <h4>Help</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="mailto:hello@songy.studio">Email us</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/refund">Refunds</a></li>
              </ul>
            </div>
          </div>
          <div className="ft-bottom">
            <span>© 2026 Songie · All rights reserved.</span>
            <span>Made with care · Delivered in 7 days</span>
          </div>
        </div>
      </footer>
    </>
  );
}
