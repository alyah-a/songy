"use server"

import { stripe } from "@/lib/stripe"
import { requireEnv } from "@/lib/env"
import { headers } from "next/headers"
import { getSongRequest, updateSongRequestStripeSession } from "./song-requests"

function getAddonSelectionFromProductId(productId: string) {
  return {
    wantsRush24: productId.includes("rush"),
    wantsVideo: productId.includes("video"),
  }
}

export async function createCheckoutSession(
  productId: string,
  orderId: number,
  metadata?: Record<string, string>
) {
  const baseSongPriceId = requireEnv("STRIPE_BASE_SONG_PRICE_ID")
  const rush24PriceId = requireEnv("STRIPE_RUSH_24HR_PRICE_ID")
  const videoAddonPriceId = requireEnv("STRIPE_VIDEO_ADDON_PRICE_ID")

  const headersList = await headers()
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const order = await getSongRequest(orderId)
  const { wantsRush24, wantsVideo } = getAddonSelectionFromProductId(productId)

  const lineItems = [
    {
      price: baseSongPriceId,
      quantity: 1,
    },
  ]

  if (wantsRush24) {
    lineItems.push({
      price: rush24PriceId,
      quantity: 1,
    })
  }

  if (wantsVideo) {
    lineItems.push({
      price: videoAddonPriceId,
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      customer_email: order?.email || undefined,
      return_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        productId,
        orderId: orderId.toString(),
        wantsRush24: String(wantsRush24),
        wantsVideo: String(wantsVideo),
        ...metadata,
      },
    } as any
  )

  // Link the stripe session to the order in the database
  await updateSongRequestStripeSession(orderId, session.id)

  return { clientSecret: session.client_secret }
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session
}
