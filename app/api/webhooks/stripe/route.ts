import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { updateSongRequestPayment } from "@/app/actions/song-requests"
import * as Sentry from "@sentry/nextjs"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    Sentry.captureException(err)
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (orderId && session.payment_status === "paid") {
          await updateSongRequestPayment(orderId, session.id, "paid")
          console.log(`Payment completed for order ${orderId}`)
        }
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (orderId) {
          await updateSongRequestPayment(orderId, session.id, "failed")
          console.log(`Payment expired for order ${orderId}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    Sentry.captureException(err)
    console.error("Webhook handler error:", err)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
