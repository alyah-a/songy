"use client"

import { useSearchParams } from "next/navigation"
import { Checkout } from "@/app/components/Checkout"

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const productId = searchParams.get("productId")
  const totalCents = searchParams.get("total")

  if (!orderId || !productId || !totalCents) {
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
      totalPriceCents={parseInt(totalCents, 10)}
    />
  )
}
