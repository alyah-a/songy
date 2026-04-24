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
    <div className="success-page">
      <div className="success-container">
        <div className="success-loading">Loading order details...</div>
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
        .success-loading {
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  )
}
