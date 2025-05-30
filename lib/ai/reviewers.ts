import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { generateReviewPrompt, generateCodeSmellPrompt } from './prompts'
import { Database } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

type ReviewType = 'security' | 'performance' | 'best-practices' | 'style'
type ReviewPersonality = 'mentor' | 'roaster' | 'guardian' | 'optimizer' | 'professor'
type AIModel = 'gpt-4' | 'claude-3-opus'

interface ReviewRequest {
  submissionId: string
  type: ReviewType
  personality: ReviewPersonality
  model: AIModel
}

interface ReviewResponse {
  rating: number
  key_points: string[]
  detailed_analysis: Record<string, number>
  suggestions: string[]
  summary: string
  code_smells: string[]
  social_share: string
}

class RateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export { RateLimitError }

class AIReviewService {
  private openai: OpenAI
  private anthropic: Anthropic
  private supabase = createClient()

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  private async checkRateLimit(userId: string): Promise<boolean> {
    const { data: recentReviews } = await this.supabase
      .from('reviews')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    return (recentReviews?.length || 0) < 10 // 10 reviews per day limit
  }

  private async generateReviewWithGPT4(prompt: string): Promise<ReviewResponse> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Provide detailed, constructive feedback with specific suggestions for improvement.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return this.parseReviewResponse(response.choices[0].message.content || '')
  }

  private async generateReviewWithClaude(prompt: string): Promise<ReviewResponse> {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return this.parseReviewResponse(response.content[0].text)
  }

  private parseReviewResponse(content: string): ReviewResponse {
    // Parse the AI response into a structured format
    // This is a simplified version - you'll want to make this more robust
    const lines = content.split('\n')
    const rating = parseInt(lines.find(line => line.includes('Overall Rating'))?.match(/\d+/)?.[0] || '5')
    
    const keyPoints = lines
      .filter(line => line.startsWith('- '))
      .map(line => line.replace('- ', ''))

    const detailedAnalysis: Record<string, number> = {}
    const suggestions: string[] = []
    let summary = ''
    let codeSmells: string[] = []
    let socialShare = ''

    let currentSection = ''
    for (const line of lines) {
      if (line.includes('Detailed Analysis:')) {
        currentSection = 'analysis'
      } else if (line.includes('Specific Suggestions:')) {
        currentSection = 'suggestions'
      } else if (line.includes("'s Take:")) {
        currentSection = 'summary'
      } else if (line.includes('Code Smells:')) {
        currentSection = 'smells'
      } else if (line.includes('Social Share:')) {
        currentSection = 'social'
      }

      if (currentSection === 'analysis' && line.includes('(')) {
        const [criteria, rating] = line.split('(')
        detailedAnalysis[criteria.trim()] = parseInt(rating)
      } else if (currentSection === 'suggestions' && line.startsWith('- ')) {
        suggestions.push(line.replace('- ', ''))
      } else if (currentSection === 'summary') {
        summary += line + '\n'
      } else if (currentSection === 'smells' && line.startsWith('- ')) {
        codeSmells.push(line.replace('- ', ''))
      } else if (currentSection === 'social') {
        socialShare += line + '\n'
      }
    }

    return {
      rating,
      key_points: keyPoints,
      detailed_analysis: detailedAnalysis,
      suggestions,
      summary: summary.trim(),
      code_smells: codeSmells,
      social_share: socialShare.trim(),
    }
  }

  async generateReview(request: ReviewRequest): Promise<Database['public']['Tables']['reviews']['Row']> {
    const { submissionId, type, personality, model } = request

    // Get submission details
    const { data: submission } = await this.supabase
      .from('submissions')
      .select('*, profiles!inner(*)')
      .eq('id', submissionId)
      .single()

    if (!submission) {
      throw new Error('Submission not found')
    }

    // Check rate limit
    const canReview = await this.checkRateLimit(submission.user_id)
    if (!canReview) {
      throw new RateLimitError('Daily review limit reached')
    }

    // Generate review prompt
    const reviewPrompt = generateReviewPrompt({
      code: submission.code,
      language: submission.language,
      description: submission.description,
      type,
      personality,
    })

    // Generate code smell analysis
    const codeSmellPrompt = generateCodeSmellPrompt(submission.code, submission.language)

    // Generate review using selected model
    const reviewResponse = model === 'gpt-4'
      ? await this.generateReviewWithGPT4(reviewPrompt)
      : await this.generateReviewWithClaude(reviewPrompt)

    // Store review in database
    const { data: review, error } = await this.supabase
      .from('reviews')
      .insert({
        submission_id: submissionId,
        user_id: submission.user_id,
        reviewer_id: submission.profiles.id,
        type,
        personality,
        model,
        rating: reviewResponse.rating,
        key_points: reviewResponse.key_points,
        detailed_analysis: reviewResponse.detailed_analysis,
        suggestions: reviewResponse.suggestions,
        summary: reviewResponse.summary,
        code_smells: reviewResponse.code_smells,
        social_share: reviewResponse.social_share,
        helpful_votes: 0,
        funny_votes: 0,
        accurate_votes: 0,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return review
  }
}

export const aiReviewService = new AIReviewService() 