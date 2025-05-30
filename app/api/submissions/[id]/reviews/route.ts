import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiReviewService } from '@/lib/ai/reviewers'
import { cookies } from 'next/headers'
import { z } from 'zod'

const reviewRequestSchema = z.object({
  type: z.enum(['security', 'performance', 'best-practices', 'style']),
  personality: z.enum(['mentor', 'roaster', 'guardian', 'optimizer', 'professor']),
  model: z.enum(['gpt-4', 'claude-3-opus']),
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = reviewRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid review request', details: validation.error },
        { status: 400 }
      )
    }

    const { type, personality, model } = validation.data

    // Check if submission exists and user has access
    const { data: submission } = await supabase
      .from('code_submissions')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Check rate limit (10 reviews per hour)
    const { data: recentReviews } = await supabase
      .from('reviews')
      .select('created_at')
      .eq('user_id', session.user.id)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

    if (recentReviews && recentReviews.length >= 10) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if a similar review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('submission_id', params.id)
      .eq('type', type)
      .eq('personality', personality)
      .eq('model', model)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: 'A similar review already exists' },
        { status: 409 }
      )
    }

    // Create a pending review record
    const { data: pendingReview, error: pendingError } = await supabase
      .from('reviews')
      .insert({
        submission_id: params.id,
        user_id: session.user.id,
        reviewer_id: session.user.id,
        type,
        personality,
        model,
        status: 'pending',
        rating: 0,
        key_points: [],
        detailed_analysis: {},
        suggestions: [],
        code_smells: [],
        helpful_votes: 0,
        funny_votes: 0,
        accurate_votes: 0,
      })
      .select()
      .single()

    if (pendingError) {
      throw pendingError
    }

    // Generate review in the background
    try {
      const review = await aiReviewService.generateReview({
        submissionId: params.id,
        type,
        personality,
        model,
      })

      // Update the review record with the generated content
      const { error: updateError } = await supabase
        .from('reviews')
        .update({
          status: 'completed',
          rating: review.rating,
          key_points: review.key_points,
          detailed_analysis: review.detailed_analysis,
          suggestions: review.suggestions,
          code_smells: review.code_smells,
          summary: review.summary,
          social_share: review.social_share,
        })
        .eq('id', pendingReview.id)

      if (updateError) {
        throw updateError
      }

      return NextResponse.json(review)
    } catch (error) {
      // Update review status to failed
      await supabase
        .from('reviews')
        .update({ status: 'failed' })
        .eq('id', pendingReview.id)

      throw error
    }
  } catch (error) {
    console.error('Error generating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 