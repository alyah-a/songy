"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getCheckoutSession } from "@/app/actions/stripe"
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

          trackEvent("payment_completed", { 
            orderId, 
            amount: session.amount_total,
            currency: session.currency 
          })

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
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          <div className="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center bg-[var(--color-surface)] p-12 rounded-xl border border-[var(--color-border)]">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-4xl font-bold mx-auto mb-6">
            !
          </div>
          <h2 className="font-[var(--font-fraunces)] text-2xl mb-3 text-[var(--color-text)]">
            Something went wrong
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            We couldn&apos;t process your payment. Please try again or contact support.
          </p>
          <Link href="/order" className="btn-flame inline-flex">
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center bg-[var(--color-surface)] p-12 rounded-xl border border-[var(--color-border)]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-4xl mx-auto mb-6">
          ♪
        </div>
        <h2 className="font-[var(--font-fraunces)] text-2xl mb-3 text-[var(--color-text)]">
          We&apos;ve got the story.
        </h2>
        <p className="text-[var(--color-text-muted)] mb-4 leading-relaxed">
          Check your inbox at <strong className="text-[var(--color-text)]">{orderDetails.email}</strong> — we&apos;ll confirm your 
          order within a few hours and kick off the brief. Your song is on its way.
        </p>
        {orderDetails.orderId && (
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Order ID: <code className="bg-[var(--color-bg)] px-2 py-1 rounded font-mono">{orderDetails.orderId}</code>
          </p>
        )}
        <Link href="/" className="btn-ghost inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  )
}
