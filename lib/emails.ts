import { resend } from "./resend"

const FROM_EMAIL = "Songie <noreply@resend.dev>"

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
  orderId: string
}) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your Songie Order Confirmation - #${orderId.slice(0, 8)}`,
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
                <p><strong>Order ID:</strong> ${orderId.slice(0, 8)}</p>
                <p><strong>Song Type:</strong> ${songType}</p>
                <p><strong>For:</strong> ${recipientName}</p>
              </div>
              
              <p>We'll start working on your personalized song right away. You'll receive another email once your song is ready!</p>
              
              <p>If you have any questions, feel free to reply to this email.</p>
              
              <p>With melody,<br>The Songie Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Songie. All rights reserved.</p>
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
  orderId: string
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
              
              <p>We hope this song brings joy and creates a memorable moment. Thank you for choosing Songie to help make this occasion special.</p>
              
              <p>If you have any feedback or questions, we'd love to hear from you!</p>
              
              <p>With melody,<br>The Songie Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Songie. All rights reserved.</p>
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
