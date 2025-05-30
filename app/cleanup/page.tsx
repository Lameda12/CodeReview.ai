'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function CleanupPage() {
  useEffect(() => {
    // Redirect to home page after cleanup
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Cleaning up...</h1>
        <p className="text-gray-400">Removing service workers and clearing cache</p>
      </div>
      <Script src="/sw-cleanup.js" strategy="beforeInteractive" />
    </div>
  )
} 