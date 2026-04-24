import { Suspense } from "react"
import { CheckoutContent } from "./checkout-content"

export default function CheckoutPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Complete Your Order</h1>
          <p>Secure payment powered by Stripe</p>
        </div>
        <Suspense fallback={<div className="checkout-loading">Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>
      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: var(--color-bg);
          padding: 2rem 1rem;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }
        .checkout-container {
          max-width: 600px;
          width: 100%;
          margin-top: 2rem;
        }
        .checkout-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .checkout-header h1 {
          font-family: var(--font-fraunces);
          font-size: 2rem;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }
        .checkout-header p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .checkout-loading {
          text-align: center;
          padding: 3rem;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  )
}
