import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { aiReviewService } from '@/lib/ai/reviewers'
import { RateLimitError } from '@/lib/ai/reviewers'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { submissionId, type, personality, model } = body

    if (!submissionId || !type || !personality || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate submission exists and user has access
    const { data: submission } = await supabase
      .from('submissions')
      .select('user_id')
      .eq('id', submissionId)
      .single()

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Generate review
    const review = await aiReviewService.generateReview({
      submissionId,
      type,
      personality,
      model,
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error generating review:', error)

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 