import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - CodeReview.ai',
  description: 'Create your CodeReview.ai account to get started with AI-powered code reviews.',
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 