import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiReviewService } from '@/lib/ai/reviewers'
import { cookies } from 'next/headers'
import { z } from 'zod'

const submissionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  code: z.string().min(1),
  language: z.string().min(1),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private']).default('public'),
})

export async function POST(request: Request) {
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
    const validation = submissionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validation.error },
        { status: 400 }
      )
    }

    const { title, description, code, language, tags, visibility } = validation.data

    // Check rate limit (5 submissions per hour)
    const { data: recentSubmissions } = await supabase
      .from('code_submissions')
      .select('created_at')
      .eq('user_id', session.user.id)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

    if (recentSubmissions && recentSubmissions.length >= 5) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('code_submissions')
      .insert({
        user_id: session.user.id,
        title,
        description,
        code,
        language,
        tags,
        visibility,
        status: 'pending',
      })
      .select()
      .single()

    if (submissionError) {
      throw submissionError
    }

    // Generate initial AI reviews in the background
    const reviewTypes = ['security', 'performance', 'best-practices', 'style'] as const
    const personalities = ['mentor', 'roaster', 'guardian', 'optimizer', 'professor'] as const
    const models = ['gpt-4', 'claude-3-opus'] as const

    // Queue reviews for generation
    reviewTypes.forEach(async (type) => {
      const personality = personalities[Math.floor(Math.random() * personalities.length)]
      const model = models[Math.floor(Math.random() * models.length)]

      try {
        await aiReviewService.generateReview({
          submissionId: submission.id,
          type,
          personality,
          model,
        })
      } catch (error) {
        console.error(`Failed to generate ${type} review:`, error)
      }
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'created_at'

    // Build query
    let query = supabase
      .from('code_submissions')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url,
          reputation
        ),
        reviews (
          id,
          rating,
          type,
          personality
        )
      `)
      .eq('visibility', 'public')
      .order(sort, { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // Apply filters
    if (language) {
      query = query.eq('language', language)
    }
    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data: submissions, error } = await query

    if (error) {
      throw error
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('code_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('visibility', 'public')

    return NextResponse.json({
      submissions,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 