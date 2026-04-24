import { Suspense } from "react"
import { SuccessContent } from "./success-content"

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  )
}

function SuccessLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center text-[var(--color-text-muted)]">
        Loading order details...
      </div>
    </div>
  )
}
