export const metadata = {
  title: "Refund Policy — SONGIE",
  description: "SONGIE's cancellation, refund, and revision policy for custom songs.",
};

export default function RefundPage() {
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

      <section className="legal-page">
        <div className="container">
          <div className="legal-header">
            <div className="eyebrow">Legal</div>
            <h1>Refund<br />Policy</h1>
            <p className="updated">Last updated: April 2026</p>
          </div>

          <div className="legal-body">
            <p>At SONGIE, all songs are custom-made digital products created specifically for each customer. Because of the personalized nature of the service, our cancellation, refund, and revision policies are limited.</p>

            <h2>1. Cancellation Policy</h2>
            <p>Because work on your order may begin shortly after purchase, cancellation eligibility depends on the turnaround option selected.</p>
            <p><strong>Standard custom song orders</strong></p>
            <ul>
              <li>If you cancel within 2 hours of purchase, you are eligible for a 100% refund</li>
              <li>If you cancel between 2 and 24 hours after purchase, you are eligible for a 50% refund</li>
              <li>If you cancel more than 24 hours after purchase, no refund will be issued</li>
            </ul>
            <p><strong>Express orders</strong></p>
            <p>For any express, rush, or priority turnaround service, including 3-day or similar expedited options:</p>
            <ul>
              <li>Orders are non-cancellable and non-refundable once placed</li>
            </ul>
            <p>This is because work begins immediately and priority production capacity is reserved for your order.</p>

            <h2>2. Refund Policy</h2>
            <p>Because your song is personalized and cannot be resold, refunds are generally not available once work has begun or once delivery has occurred, except where required by law.</p>
            <p>Refunds will not be provided due to:</p>
            <ul>
              <li>Personal taste or subjective dissatisfaction alone</li>
              <li>A change of mind after work has started</li>
              <li>Incorrect details submitted by you</li>
              <li>Failure to check spam, junk, or provided delivery instructions</li>
              <li>Technical issues on your own device, browser, email, or internet connection</li>
            </ul>
            <p>If SONGIE fails to deliver a product substantially as described due solely to an error on our side, we may choose to correct and re-deliver the product, or issue a partial or full refund at our discretion.</p>
            <p>Any approved refund will be sent to the original payment method. Processing times depend on your payment provider.</p>

            <h2>3. Corrections and Small Edits</h2>
            <p>If your delivered song contains a factual error such as a misspelled name, an incorrect detail taken from your submitted questionnaire, or a minor lyric phrasing issue, you must contact us within 14 days of delivery at <a href="mailto:hello@songy.studio">hello@songy.studio</a>.</p>
            <p>We may provide one round of small corrections at no additional charge.</p>
            <p>Small edits do not include:</p>
            <ul>
              <li>Full rewrites</li>
              <li>Style changes</li>
              <li>Melody changes</li>
              <li>Genre changes</li>
              <li>Replacing the original concept with a new one</li>
            </ul>
            <p>Major changes may require an additional fee or may not be available.</p>

            <h2>4. Add-Ons and Upgrades</h2>
            <p>Any add-ons, rush fees, priority delivery fees, upgraded media packages, or similar extras are non-refundable once purchased.</p>

            <h2>5. Technical Issues</h2>
            <p>If you experience a technical issue accessing your delivered file or link, contact us at <a href="mailto:hello@songy.studio">hello@songy.studio</a>.</p>
            <p>If the issue is caused by us, we will make reasonable efforts to resend the file, provide a replacement link, or otherwise correct the issue. Technical issues do not automatically entitle you to a refund.</p>

            <h2>6. Chargebacks</h2>
            <p>If you believe you were charged incorrectly, please contact us first at <a href="mailto:hello@songy.studio">hello@songy.studio</a> so we can try to resolve the issue.</p>
            <p>Initiating a chargeback without first contacting us may delay resolution. We reserve the right to dispute fraudulent or abusive chargebacks and to refuse future service where misuse is suspected.</p>

            <h2>7. Contact</h2>
            <p>For cancellation, refund, or revision requests, contact:</p>
            <p>
              SONGIE<br />
              Email: <a href="mailto:hello@songy.studio">hello@songy.studio</a>
            </p>
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
