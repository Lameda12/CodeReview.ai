import { generateReviewPrompt, generateSecurityFocusedPrompt, generatePerformancePrompt, generateArchitecturePrompt, type PromptConfig, type ReviewPrompt } from './advanced-prompts'

export interface AIProvider {
  name: string
  model: string
  apiKey?: string
  endpoint?: string
}

export interface ReviewRequest {
  code: string
  language: string
  reviewType: 'general' | 'security' | 'performance' | 'architecture'
  config?: PromptConfig
  provider?: AIProvider
}

export interface ReviewResponse {
  id: string
  content: string
  rating: number
  suggestions: Array<{
    id: string
    before: string
    after: string
    explanation: string
    category: 'performance' | 'security' | 'style' | 'bug' | 'optimization'
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
  metrics: {
    complexity: number
    maintainability: number
    performance: number
    security: number
    testability: number
    documentation: number
  }
  tags: string[]
  estimatedFixTime: number
  author: {
    name: string
    avatar: string
    type: 'ai'
    model: string
    personality?: string
  }
  timestamp: string
  helpful: number
  notHelpful: number
}

const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
  google: {
    name: 'Google',
    models: ['gemini-pro', 'gemini-pro-vision'],
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
  cohere: {
    name: 'Cohere',
    models: ['command', 'command-light'],
    endpoint: 'https://api.cohere.ai/v1/generate',
  },
}

class ReviewService {
  private defaultProvider: AIProvider = {
    name: 'OpenAI',
    model: 'gpt-4',
  }

  async generateReview(request: ReviewRequest): Promise<ReviewResponse> {
    const prompt = this.generatePrompt(request)
    const provider = request.provider || this.defaultProvider

    try {
      const response = await this.callAI(prompt, provider)
      return this.parseResponse(response, provider)
    } catch (error) {
      console.error('AI Review Error:', error)
      return this.generateFallbackResponse(request)
    }
  }

  async generateMultipleReviews(request: ReviewRequest, providers: AIProvider[]): Promise<ReviewResponse[]> {
    const promises = providers.map(provider =>
      this.generateReview({ ...request, provider })
    )

    try {
      const results = await Promise.allSettled(promises)
      return results
        .filter((result): result is PromiseFulfilledResult<ReviewResponse> => result.status === 'fulfilled')
        .map(result => result.value)
    } catch (error) {
      console.error('Multiple AI Review Error:', error)
      return [this.generateFallbackResponse(request)]
    }
  }

  async generateComparativeReview(request: ReviewRequest): Promise<{
    consensus: ReviewResponse
    individual: ReviewResponse[]
    comparison: {
      agreements: string[]
      disagreements: string[]
      confidence: number
    }
  }> {
    const providers = [
      { name: 'OpenAI', model: 'gpt-4' },
      { name: 'Anthropic', model: 'claude-3-sonnet' },
      { name: 'Google', model: 'gemini-pro' },
    ]

    const reviews = await this.generateMultipleReviews(request, providers)
    const consensus = this.generateConsensus(reviews)
    const comparison = this.compareReviews(reviews)

    return {
      consensus,
      individual: reviews,
      comparison,
    }
  }

  private generatePrompt(request: ReviewRequest): ReviewPrompt {
    switch (request.reviewType) {
      case 'security':
        return generateSecurityFocusedPrompt(request.language, request.code)
      case 'performance':
        return generatePerformancePrompt(request.language, request.code)
      case 'architecture':
        return generateArchitecturePrompt(request.language, request.code)
      default:
        return generateReviewPrompt(
          request.config || {
            language: request.language,
            reviewStyle: 'detailed',
            focusAreas: ['best practices', 'code quality', 'maintainability'],
            userLevel: 'intermediate',
          },
          request.code
        )
    }
  }

  private async callAI(prompt: ReviewPrompt, provider: AIProvider): Promise<any> {
    // This is a mock implementation - replace with actual API calls
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simulate different AI responses based on provider
    const mockResponses = {
      'OpenAI': this.generateMockOpenAIResponse(prompt),
      'Anthropic': this.generateMockAnthropicResponse(prompt),
      'Google': this.generateMockGoogleResponse(prompt),
      'Cohere': this.generateMockCohereResponse(prompt),
    }

    return mockResponses[provider.name as keyof typeof mockResponses] || mockResponses.OpenAI
  }

  private parseResponse(response: any, provider: AIProvider): ReviewResponse {
    // Parse the AI response and convert to our standard format
    const parsed = typeof response === 'string' ? JSON.parse(response) : response

    return {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: parsed.content || 'AI review content',
      rating: parsed.rating || 4,
      suggestions: parsed.suggestions || [],
      metrics: parsed.metrics || {
        complexity: 75,
        maintainability: 80,
        performance: 85,
        security: 70,
        testability: 75,
        documentation: 65,
      },
      tags: parsed.tags || ['code-review', 'ai-generated'],
      estimatedFixTime: parsed.estimatedFixTime || 15,
      author: {
        name: `${provider.name} AI`,
        avatar: `/ai-${provider.name.toLowerCase()}.png`,
        type: 'ai',
        model: provider.model,
        personality: parsed.personality || 'analytical',
      },
      timestamp: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
    }
  }

  private generateFallbackResponse(request: ReviewRequest): ReviewResponse {
    return {
      id: `fallback-${Date.now()}`,
      content: 'Unable to generate AI review at this time. Please try again later.',
      rating: 3,
      suggestions: [],
      metrics: {
        complexity: 50,
        maintainability: 50,
        performance: 50,
        security: 50,
        testability: 50,
        documentation: 50,
      },
      tags: ['fallback'],
      estimatedFixTime: 0,
      author: {
        name: 'System',
        avatar: '/system-avatar.png',
        type: 'ai',
        model: 'fallback',
      },
      timestamp: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
    }
  }

  private generateConsensus(reviews: ReviewResponse[]): ReviewResponse {
    if (reviews.length === 0) {
      throw new Error('No reviews to generate consensus from')
    }

    if (reviews.length === 1) {
      return reviews[0]
    }

    // Calculate average metrics
    const avgMetrics = {
      complexity: 0,
      maintainability: 0,
      performance: 0,
      security: 0,
      testability: 0,
      documentation: 0,
    }

    // Calculate averages for each metric
    Object.keys(avgMetrics).forEach(key => {
      const metricKey = key as keyof typeof avgMetrics
      const values = reviews.map(r => r.metrics[metricKey])
      avgMetrics[metricKey] = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
    })

    // Combine suggestions (remove duplicates)
    const allSuggestions = reviews.flatMap(r => r.suggestions)
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) =>
      index === self.findIndex(s => s.explanation === suggestion.explanation)
    )

    // Combine tags
    const allTags = [...new Set(reviews.flatMap(r => r.tags))]

    // Average rating
    const avgRating = Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)

    // Combine content
    const consensusContent = `Consensus review based on ${reviews.length} AI models:\n\n${reviews.map(r => r.content).join('\n\n---\n\n')}`

    return {
      id: `consensus-${Date.now()}`,
      content: consensusContent,
      rating: avgRating,
      suggestions: uniqueSuggestions,
      metrics: avgMetrics,
      tags: allTags,
      estimatedFixTime: Math.max(...reviews.map(r => r.estimatedFixTime)),
      author: {
        name: 'AI Consensus',
        avatar: '/consensus-avatar.png',
        type: 'ai',
        model: 'multi-model',
        personality: 'comprehensive',
      },
      timestamp: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
    }
  }

  private compareReviews(reviews: ReviewResponse[]): {
    agreements: string[]
    disagreements: string[]
    confidence: number
  } {
    // Simplified comparison logic
    const agreements: string[] = []
    const disagreements: string[] = []

    // Compare ratings
    const ratings = reviews.map(r => r.rating)
    const ratingVariance = Math.max(...ratings) - Math.min(...ratings)
    
    if (ratingVariance <= 1) {
      agreements.push(`All models agree on similar rating (${Math.round(ratings.reduce((a, b) => a + b) / ratings.length)}/5)`)
    } else {
      disagreements.push(`Models disagree on rating (range: ${Math.min(...ratings)}-${Math.max(...ratings)})`)
    }

    // Compare suggestion counts
    const suggestionCounts = reviews.map(r => r.suggestions.length)
    const suggestionVariance = Math.max(...suggestionCounts) - Math.min(...suggestionCounts)
    
    if (suggestionVariance <= 2) {
      agreements.push('Models agree on number of suggestions needed')
    } else {
      disagreements.push('Models disagree on number of suggestions')
    }

    // Calculate confidence based on agreement level
    const confidence = Math.max(0, 100 - (disagreements.length * 20))

    return {
      agreements,
      disagreements,
      confidence,
    }
  }

  // Mock response generators for different providers
  private generateMockOpenAIResponse(prompt: ReviewPrompt): any {
    return {
      content: 'This code demonstrates good structure and follows many best practices. The component is well-organized with clear separation of concerns. However, there are several areas where we can improve security, performance, and maintainability.',
      rating: 4,
      suggestions: [
        {
          id: '1',
          before: 'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
          after: 'const emailRegex = /^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;',
          explanation: 'Use a more robust email validation regex that follows RFC 5322 standards.',
          category: 'security',
          severity: 'medium',
        },
      ],
      metrics: {
        complexity: 75,
        maintainability: 85,
        performance: 90,
        security: 70,
        testability: 80,
        documentation: 65,
      },
      tags: ['react', 'typescript', 'forms', 'validation'],
      estimatedFixTime: 25,
    }
  }

  private generateMockAnthropicResponse(prompt: ReviewPrompt): any {
    return {
      content: 'Your authentication component shows solid understanding of React patterns and TypeScript usage. The form validation approach is sound, though there are opportunities to enhance security and user experience.',
      rating: 4,
      suggestions: [
        {
          id: '2',
          before: 'return password.length >= 8;',
          after: 'return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/.test(password);',
          explanation: 'Strengthen password validation by requiring uppercase, lowercase, and numeric characters.',
          category: 'security',
          severity: 'high',
        },
      ],
      metrics: {
        complexity: 70,
        maintainability: 88,
        performance: 85,
        security: 65,
        testability: 82,
        documentation: 70,
      },
      tags: ['authentication', 'security', 'react-hooks'],
      estimatedFixTime: 20,
    }
  }

  private generateMockGoogleResponse(prompt: ReviewPrompt): any {
    return {
      content: 'The code structure is clean and follows React best practices. Good use of TypeScript for type safety. Consider adding more comprehensive error handling and accessibility features.',
      rating: 4,
      suggestions: [
        {
          id: '3',
          before: 'className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"',
          after: 'className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"',
          explanation: 'Add focus styles for better accessibility and user experience.',
          category: 'style',
          severity: 'low',
        },
      ],
      metrics: {
        complexity: 72,
        maintainability: 83,
        performance: 88,
        security: 75,
        testability: 78,
        documentation: 68,
      },
      tags: ['accessibility', 'ux', 'styling'],
      estimatedFixTime: 15,
    }
  }

  private generateMockCohereResponse(prompt: ReviewPrompt): any {
    return {
      content: 'Well-structured authentication component with good separation of validation logic. The error handling provides clear user feedback. Some improvements in security and performance would be beneficial.',
      rating: 4,
      suggestions: [],
      metrics: {
        complexity: 78,
        maintainability: 80,
        performance: 82,
        security: 72,
        testability: 76,
        documentation: 62,
      },
      tags: ['clean-code', 'maintainable'],
      estimatedFixTime: 18,
    }
  }
}

export const reviewService = new ReviewService()
export default ReviewService 