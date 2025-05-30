'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Something went wrong!</h2>
          </div>
          <p className="mt-2 text-sm text-red-300">
            {error.message || 'An unexpected error occurred while loading the reviews.'}
          </p>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
} 