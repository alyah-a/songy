import { resend } from "./resend"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SONGIE <noreply@resend.dev>"
const CREATIVE_DIRECTOR_EMAIL = process.env.CREATIVE_DIRECTOR_EMAIL
const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL

type InternalOrderEmailData = {
  id: number | string
  recipientName: string
  relationship: string
  occasion: string
  story: string
  email: string
  addons?: string[] | null
  totalPriceCents: number
  productId?: string | null
  stripeSessionId?: string | null
  stripePaymentIntentId?: string | null
  paymentStatus?: string | null
  orderStatus?: string | null
  nameRecordingUrl?: string | null
  createdAt?: string | Date | null
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

function formatAddons(addons?: string[] | null) {
  return addons?.length ? addons.join(", ") : "None"
}

function getNameRecordingAttachment(nameRecordingUrl?: string | null) {
  if (!nameRecordingUrl?.startsWith("data:")) {
    return undefined
  }

  const match = nameRecordingUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    return undefined
  }

  const [, contentType, content] = match
  const extension = contentType.includes("mpeg")
    ? "mp3"
    : contentType.includes("wav")
      ? "wav"
      : contentType.includes("mp4")
        ? "m4a"
        : "webm"

  return {
    filename: `name-pronunciation.${extension}`,
    content,
    contentType,
  }
}

function surveyResponseHtml(order: InternalOrderEmailData) {
  return `
    <div class="section">
      <h2>Survey Response</h2>
      <p><strong>Recipient:</strong> ${escapeHtml(order.recipientName)}</p>
      <p><strong>From / relationship:</strong> ${escapeHtml(order.relationship)}</p>
      <p><strong>Occasion:</strong> ${escapeHtml(order.occasion)}</p>
      <p><strong>Customer email:</strong> ${escapeHtml(order.email)}</p>
      <p><strong>Add-ons:</strong> ${escapeHtml(formatAddons(order.addons))}</p>
      <p><strong>Name pronunciation:</strong> ${order.nameRecordingUrl ? "Attached to this email" : "Not provided"}</p>
      <div class="story">
        <strong>Story, memories, inside jokes</strong>
        <p>${escapeHtml(order.story).replaceAll("\n", "<br />")}</p>
      </div>
    </div>
  `
}

function internalEmailShell(title: string, body: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.55; color: #111010; }
          .container { max-width: 720px; margin: 0 auto; padding: 24px; }
          .header { background: #ff4a1c; color: #fff8e8; padding: 24px; }
          .content { background: #fff8e8; padding: 24px; border: 2px solid #111010; }
          h1 { margin: 0; font-size: 24px; }
          h2 { margin-top: 0; font-size: 18px; }
          .section { margin-bottom: 24px; }
          .story { background: #fff; border-left: 4px solid #ff4a1c; padding: 16px; margin-top: 16px; }
          .meta { width: 100%; border-collapse: collapse; }
          .meta td { border-bottom: 1px solid rgba(17,16,16,.15); padding: 8px 0; vertical-align: top; }
          .meta td:first-child { width: 190px; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>${escapeHtml(title)}</h1></div>
          <div class="content">${body}</div>
        </div>
      </body>
    </html>
  `
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  recipientName,
  songType,
  orderId,
}: {
  to: string
  customerName: string
  recipientName: string
  songType: string
  orderId: number | string
}) {
  const orderIdStr = String(orderId)
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your SONGIE Order Confirmation - #${orderIdStr.slice(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Order!</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>We've received your order and our talented musicians are getting ready to create something special!</p>
              
              <div class="highlight">
                <p><strong>Order ID:</strong> ${orderIdStr.slice(0, 8)}</p>
                <p><strong>Song Type:</strong> ${songType}</p>
                <p><strong>For:</strong> ${recipientName}</p>
              </div>
              
              <p>We'll start working on your personalized song right away. You'll receive another email once your song is ready!</p>
              
              <p>If you have any questions, feel free to reply to this email.</p>
              
              <p>With melody,<br>The SONGIE Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SONGIE. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error("Failed to send order confirmation email:", error)
    throw error
  }

  return data
}

export async function sendSongReadyEmail({
  to,
  customerName,
  recipientName,
  orderId,
}: {
  to: string
  customerName: string
  recipientName: string
  orderId: number | string
}) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your Song for ${recipientName} is Ready!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .cta-button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Song is Ready!</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Great news! The personalized song for <strong>${recipientName}</strong> is now complete!</p>
              
              <p>We hope this song brings joy and creates a memorable moment. Thank you for choosing SONGIE to help make this occasion special.</p>
              
              <p>If you have any feedback or questions, we'd love to hear from you!</p>
              
              <p>With melody,<br>The SONGIE Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SONGIE. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error("Failed to send song ready email:", error)
    throw error
  }

  return data
}

export async function sendCreativeDirectorBriefEmail(order: InternalOrderEmailData) {
  if (!CREATIVE_DIRECTOR_EMAIL) {
    console.warn("Skipping creative director email: CREATIVE_DIRECTOR_EMAIL is not set")
    return null
  }

  const recordingAttachment = getNameRecordingAttachment(order.nameRecordingUrl)
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: CREATIVE_DIRECTOR_EMAIL,
    replyTo: order.email,
    subject: `New SONGIE brief: ${order.recipientName} - ${order.occasion}`,
    html: internalEmailShell(
      "New Creative Brief",
      `
        ${surveyResponseHtml(order)}
        <p>Replying to this email will reply to the customer.</p>
      `
    ),
    attachments: recordingAttachment ? [recordingAttachment] : undefined,
  })

  if (error) {
    console.error("Failed to send creative director brief email:", error)
    throw error
  }

  return data
}

export async function sendOwnerOrderNotificationEmail(order: InternalOrderEmailData) {
  if (!ORDER_NOTIFICATION_EMAIL) {
    console.warn("Skipping owner order email: ORDER_NOTIFICATION_EMAIL is not set")
    return null
  }

  const recordingAttachment = getNameRecordingAttachment(order.nameRecordingUrl)
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: ORDER_NOTIFICATION_EMAIL,
    replyTo: order.email,
    subject: `Paid SONGIE order #${String(order.id)} - ${formatCents(order.totalPriceCents)}`,
    html: internalEmailShell(
      "Paid Order Notification",
      `
        <div class="section">
          <h2>Order Information</h2>
          <table class="meta">
            <tr><td>Order ID</td><td>${escapeHtml(order.id)}</td></tr>
            <tr><td>Total paid</td><td>${escapeHtml(formatCents(order.totalPriceCents))}</td></tr>
            <tr><td>Product</td><td>${escapeHtml(order.productId || "Unknown")}</td></tr>
            <tr><td>Payment status</td><td>${escapeHtml(order.paymentStatus || "Unknown")}</td></tr>
            <tr><td>Order status</td><td>${escapeHtml(order.orderStatus || "Unknown")}</td></tr>
            <tr><td>Stripe session</td><td>${escapeHtml(order.stripeSessionId || "None")}</td></tr>
            <tr><td>Stripe payment intent</td><td>${escapeHtml(order.stripePaymentIntentId || "None")}</td></tr>
            <tr><td>Created</td><td>${escapeHtml(order.createdAt || "Unknown")}</td></tr>
          </table>
        </div>
        ${surveyResponseHtml(order)}
      `
    ),
    attachments: recordingAttachment ? [recordingAttachment] : undefined,
  })

  if (error) {
    console.error("Failed to send owner order notification email:", error)
    throw error
  }

  return data
}
