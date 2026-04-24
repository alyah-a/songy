import { Suspense } from "react"
import { CheckoutContent } from "./checkout-content"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-8 flex items-start justify-center">
      <div className="max-w-xl w-full mt-8">
        <div className="text-center mb-8">
          <h1 className="font-[var(--font-fraunces)] text-3xl text-[var(--color-text)] mb-2">
            Complete Your Order
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Secure payment powered by Stripe
          </p>
        </div>
        <Suspense fallback={
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            Loading checkout...
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  )
}
