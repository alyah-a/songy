"use client"

import { useCallback, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { createCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutProps {
  productId: string
  orderId: number
  totalPriceCents: number
}

export function Checkout({ productId, orderId, totalPriceCents }: CheckoutProps) {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const { clientSecret } = await createCheckoutSession(productId, orderId, totalPriceCents)
      if (!clientSecret) {
        throw new Error("No client secret returned")
      }
      return clientSecret
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout")
      throw err
    }
  }, [productId, orderId, totalPriceCents])

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
