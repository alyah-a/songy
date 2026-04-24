"use server"

import { sql } from "@/lib/db"
import { sendOrderConfirmationEmail } from "@/lib/emails"
import * as Sentry from "@sentry/nextjs"

// Data structure matching the actual database schema
export interface SongRequestData {
  recipientName: string
  relationship: string
  occasion: string
  story: string
  email: string
  addons?: string[]
  totalPriceCents: number
  productId: string
  nameRecordingUrl?: string
}

export async function createSongRequest(data: SongRequestData) {
  try {
    const result = await sql`
      INSERT INTO song_requests (
        recipient_name,
        relationship,
        occasion,
        story,
        email,
        addons,
        total_price_cents,
        payment_status,
        order_status
      ) VALUES (
        ${data.recipientName},
        ${data.relationship},
        ${data.occasion},
        ${data.story},
        ${data.email},
        ${data.addons || []},
        ${data.totalPriceCents},
        'pending',
        'pending'
      )
      RETURNING id
    `

    return { success: true, orderId: result[0].id }
  } catch (error) {
    Sentry.captureException(error)
    console.error("Failed to create song request:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function updateSongRequestStripeSession(
  orderId: number,
  stripeSessionId: string
) {
  try {
    await sql`
      UPDATE song_requests 
      SET 
        stripe_session_id = ${stripeSessionId},
        updated_at = NOW()
      WHERE id = ${orderId}
    `
    return { success: true }
  } catch (error) {
    Sentry.captureException(error)
    console.error("Failed to update stripe session:", error)
    return { success: false, error: "Failed to update stripe session" }
  }
}

export async function updateSongRequestPayment(
  stripeSessionId: string,
  paymentIntentId: string,
  paymentStatus: "paid" | "failed"
) {
  try {
    await sql`
      UPDATE song_requests 
      SET 
        stripe_payment_intent_id = ${paymentIntentId},
        payment_status = ${paymentStatus},
        order_status = ${paymentStatus === "paid" ? "confirmed" : "cancelled"},
        updated_at = NOW()
      WHERE stripe_session_id = ${stripeSessionId}
    `

    if (paymentStatus === "paid") {
      // Fetch order details for email
      const order = await sql`
        SELECT * FROM song_requests WHERE stripe_session_id = ${stripeSessionId}
      `

      if (order[0]) {
        try {
          await sendOrderConfirmationEmail({
            to: order[0].email,
            customerName: order[0].recipient_name,
            recipientName: order[0].recipient_name,
            songType: order[0].occasion,
            orderId: order[0].id,
          })
        } catch (emailError) {
          Sentry.captureException(emailError)
          console.error("Failed to send confirmation email:", emailError)
        }
      }
    }

    return { success: true }
  } catch (error) {
    Sentry.captureException(error)
    console.error("Failed to update payment status:", error)
    return { success: false, error: "Failed to update payment" }
  }
}

export async function getSongRequest(orderId: number) {
  try {
    const result = await sql`
      SELECT * FROM song_requests WHERE id = ${orderId}
    `
    return result[0] || null
  } catch (error) {
    Sentry.captureException(error)
    console.error("Failed to get song request:", error)
    return null
  }
}

export async function getSongRequestByStripeSession(sessionId: string) {
  try {
    const result = await sql`
      SELECT * FROM song_requests WHERE stripe_session_id = ${sessionId}
    `
    return result[0] || null
  } catch (error) {
    Sentry.captureException(error)
    console.error("Failed to get song request by session:", error)
    return null
  }
}
