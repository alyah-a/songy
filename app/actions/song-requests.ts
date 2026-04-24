"use server"

import { sql } from "@/lib/db"
import { sendOrderConfirmationEmail } from "@/lib/emails"
import * as Sentry from "@sentry/nextjs"

export interface SongRequestData {
  recipientName: string
  recipientEmail?: string
  senderName: string
  senderEmail: string
  occasion: string
  songType: string
  story: string
  specialRequests?: string
  productId: string
}

export async function createSongRequest(data: SongRequestData) {
  try {
    const result = await sql`
      INSERT INTO song_requests (
        recipient_name,
        recipient_email,
        sender_name,
        sender_email,
        occasion,
        song_type,
        story,
        special_requests,
        product_id,
        status
      ) VALUES (
        ${data.recipientName},
        ${data.recipientEmail || null},
        ${data.senderName},
        ${data.senderEmail},
        ${data.occasion},
        ${data.songType},
        ${data.story},
        ${data.specialRequests || null},
        ${data.productId},
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

export async function updateSongRequestPayment(
  orderId: string,
  stripeSessionId: string,
  paymentStatus: "paid" | "failed"
) {
  try {
    await sql`
      UPDATE song_requests 
      SET 
        stripe_session_id = ${stripeSessionId},
        payment_status = ${paymentStatus},
        status = ${paymentStatus === "paid" ? "confirmed" : "cancelled"},
        updated_at = NOW()
      WHERE id = ${orderId}
    `

    if (paymentStatus === "paid") {
      // Fetch order details for email
      const order = await sql`
        SELECT * FROM song_requests WHERE id = ${orderId}
      `

      if (order[0]) {
        try {
          await sendOrderConfirmationEmail({
            to: order[0].sender_email,
            customerName: order[0].sender_name,
            recipientName: order[0].recipient_name,
            songType: order[0].song_type,
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

export async function getSongRequest(orderId: string) {
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
