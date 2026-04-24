"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getCheckoutSession } from "@/app/actions/stripe"
import { updateSongRequestPayment } from "@/app/actions/song-requests"
import { trackEvent } from "@/app/providers/PostHogProvider"
import Link from "next/link"

export function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [orderDetails, setOrderDetails] = useState<{
    email?: string
    orderId?: string
  }>({})

  useEffect(() => {
    async function processPayment() {
      if (!sessionId) {
        setStatus("error")
        return
      }

      try {
        const session = await getCheckoutSession(sessionId)
        
        if (session.payment_status === "paid") {
          const orderId = session.metadata?.orderId
          
          if (orderId) {
            await updateSongRequestPayment(orderId, sessionId, "paid")
            trackEvent("payment_completed", { 
              orderId, 
              amount: session.amount_total,
              currency: session.currency 
            })
          }

          setOrderDetails({
            email: session.customer_details?.email || undefined,
            orderId: orderId || undefined,
          })
          setStatus("success")
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("Failed to process payment:", error)
        setStatus("error")
      }
    }

    processPayment()
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="success-spinner" />
          <p>Processing your payment...</p>
        </div>
        <style jsx>{`
          .success-page {
            min-height: 100vh;
            background: var(--color-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }
          .success-container {
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .success-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--color-border);
            border-top-color: var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="success-page">
        <div className="success-container error">
          <div className="success-icon error-icon">!</div>
          <h2>Something went wrong</h2>
          <p>We couldn&apos;t process your payment. Please try again or contact support.</p>
          <Link href="/order" className="btn-flame">
            Try Again
          </Link>
        </div>
        <style jsx>{`
          .success-page {
            min-height: 100vh;
            background: var(--color-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }
          .success-container {
            max-width: 500px;
            width: 100%;
            text-align: center;
            background: var(--color-surface);
            padding: 3rem 2rem;
            border-radius: 1rem;
            border: 1px solid var(--color-border);
          }
          .success-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            margin: 0 auto 1.5rem;
          }
          .error-icon {
            background: #fef2f2;
            color: #dc2626;
          }
          h2 {
            font-family: var(--font-fraunces);
            font-size: 1.75rem;
            margin-bottom: 0.75rem;
            color: var(--color-text);
          }
          p {
            color: var(--color-text-muted);
            margin-bottom: 1.5rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">♪</div>
        <h2>We&apos;ve got the story.</h2>
        <p>
          Check your inbox at <strong>{orderDetails.email}</strong> — we&apos;ll confirm your 
          order within a few hours and kick off the brief. Your song is on its way.
        </p>
        {orderDetails.orderId && (
          <p className="order-id">
            Order ID: <code>{orderDetails.orderId.slice(0, 8)}</code>
          </p>
        )}
        <Link href="/" className="btn-ghost">
          Back to home
        </Link>
      </div>
      <style jsx>{`
        .success-page {
          min-height: 100vh;
          background: var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .success-container {
          max-width: 500px;
          width: 100%;
          text-align: center;
          background: var(--color-surface);
          padding: 3rem 2rem;
          border-radius: 1rem;
          border: 1px solid var(--color-border);
        }
        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 1.5rem;
        }
        h2 {
          font-family: var(--font-fraunces);
          font-size: 1.75rem;
          margin-bottom: 0.75rem;
          color: var(--color-text);
        }
        p {
          color: var(--color-text-muted);
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        p strong {
          color: var(--color-text);
        }
        .order-id {
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .order-id code {
          background: var(--color-bg);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: var(--font-jetbrains-mono);
        }
      `}</style>
    </div>
  )
}
