"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"
import { headers } from "next/headers"
import { updateSongRequestStripeSession } from "./song-requests"

export async function createCheckoutSession(
  productId: string, 
  orderId: number,
  totalPriceCents: number,
  metadata?: Record<string, string>
) {
  const product = PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    throw new Error(`Product not found: ${productId}`)
  }

  const headersList = await headers()
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: totalPriceCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      productId: product.id,
      orderId: orderId.toString(),
      ...metadata,
    },
  })

  // Link the stripe session to the order in the database
  await updateSongRequestStripeSession(orderId, session.id)

  return { clientSecret: session.client_secret }
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session
}
