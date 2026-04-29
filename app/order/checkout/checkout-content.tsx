"use client"

import { useSearchParams } from "next/navigation"
import { Checkout } from "@/app/components/Checkout"

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const productId = searchParams.get("productId")

  if (!orderId || !productId) {
    return (
      <div className="checkout-error">
        <p>Invalid checkout session. Please start your order again.</p>
        <a href="/order" className="btn-ghost">
          Back to order
        </a>
      </div>
    )
  }

  return (
    <Checkout
      productId={productId}
      orderId={parseInt(orderId, 10)}
    />
  )
}
