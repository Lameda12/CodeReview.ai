import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - CodeReview.ai',
  description: 'Login to your CodeReview.ai account to get started with AI-powered code reviews.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 