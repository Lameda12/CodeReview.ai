import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/layout/Navigation'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeReview.ai - AI-Powered Code Review Platform',
  description: 'Get intelligent code reviews from multiple AI models. Improve your code quality with detailed feedback, suggestions, and best practices.',
  keywords: ['code review', 'AI', 'programming', 'code quality', 'software development'],
  authors: [{ name: 'CodeReview.ai Team' }],
  openGraph: {
    title: 'CodeReview.ai - AI-Powered Code Review Platform',
    description: 'Get intelligent code reviews from multiple AI models',
    type: 'website',
    url: 'https://codereview.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeReview.ai',
    description: 'AI-Powered Code Review Platform',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white antialiased`}>
        {/* Service Worker Cleanup Script */}
        <Script id="sw-cleanup" strategy="beforeInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                  console.log('Unregistering service worker:', registration.scope);
                  registration.unregister();
                }
                console.log('All service workers unregistered');
              }).catch(function(error) {
                console.log('Service worker unregistration failed:', error);
              });
            }
          `}
        </Script>
        
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f3f4f6',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f3f4f6',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
