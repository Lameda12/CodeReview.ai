import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../page'

// Mock Supabase client
const signInWithOAuth = jest.fn()
const signInWithPassword = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth,
      signInWithPassword,
    },
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    signInWithOAuth.mockReset()
    signInWithPassword.mockReset()
  })

  it('renders login form', () => {
    render(<LoginPage />)
    
    // Check for main elements
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('handles GitHub login', async () => {
    // Mock a pending promise to keep loading state
    signInWithOAuth.mockImplementation(() => new Promise(() => {}))
    render(<LoginPage />)
    
    const githubButton = screen.getByText('Continue with GitHub')
    await userEvent.click(githubButton)
    
    // Check if loading state is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles email login', async () => {
    // Mock a pending promise to keep loading state
    signInWithPassword.mockImplementation(() => new Promise(() => {}))
    render(<LoginPage />)
    
    // Fill in the form
    await userEvent.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    
    // Submit the form
    const submitButton = screen.getByText('Sign in')
    await userEvent.click(submitButton)
    
    // Check if loading state is shown
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })

  it('shows error message on failed login', async () => {
    signInWithPassword.mockRejectedValueOnce(new Error('Invalid credentials'))
    render(<LoginPage />)
    
    // Fill in the form
    await userEvent.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpassword')
    
    // Submit the form
    const submitButton = screen.getByText('Sign in')
    await userEvent.click(submitButton)
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to sign in')).toBeInTheDocument()
    })
  })
}) 