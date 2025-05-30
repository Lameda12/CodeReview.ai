import { Database } from '@/types/database'

type ReviewType = 'security' | 'performance' | 'best-practices' | 'style'
type ReviewPersonality = 'mentor' | 'roaster' | 'guardian' | 'optimizer' | 'professor'

interface ReviewContext {
  code: string
  language: string
  description: string
  type: ReviewType
  personality: ReviewPersonality
}

const personalities = {
  mentor: {
    name: '🤖 The Mentor',
    description: 'Encouraging and educational, focused on helping developers learn and improve.',
    tone: 'friendly and supportive',
    emoji: '🤖',
  },
  roaster: {
    name: '😈 The Roaster',
    description: 'Funny and sarcastic, perfect for viral content and entertainment.',
    tone: 'witty and humorous',
    emoji: '😈',
  },
  guardian: {
    name: '🛡️ The Guardian',
    description: 'Security-focused, identifying vulnerabilities and potential threats.',
    tone: 'serious and vigilant',
    emoji: '🛡️',
  },
  optimizer: {
    name: '⚡ The Optimizer',
    description: 'Performance-focused, finding bottlenecks and optimization opportunities.',
    tone: 'analytical and precise',
    emoji: '⚡',
  },
  professor: {
    name: '📚 The Professor',
    description: 'Best practices and clean code advocate, focusing on maintainability.',
    tone: 'educational and thorough',
    emoji: '📚',
  },
}

const reviewTypes = {
  security: {
    name: 'Security Review',
    focus: 'vulnerabilities, data protection, and security best practices',
    ratingCriteria: [
      'Input validation',
      'Authentication/Authorization',
      'Data encryption',
      'Error handling',
      'Dependency security',
    ],
  },
  performance: {
    name: 'Performance Review',
    focus: 'optimization, resource usage, and efficiency',
    ratingCriteria: [
      'Algorithm complexity',
      'Memory usage',
      'CPU utilization',
      'I/O operations',
      'Caching strategy',
    ],
  },
  'best-practices': {
    name: 'Best Practices Review',
    focus: 'code quality, maintainability, and industry standards',
    ratingCriteria: [
      'Code organization',
      'Documentation',
      'Error handling',
      'Testing coverage',
      'Maintainability',
    ],
  },
  style: {
    name: 'Style Review',
    focus: 'readability, consistency, and coding style',
    ratingCriteria: [
      'Naming conventions',
      'Code formatting',
      'Comment quality',
      'Function length',
      'Variable usage',
    ],
  },
}

export function generateReviewPrompt(context: ReviewContext): string {
  const personality = personalities[context.personality]
  const reviewType = reviewTypes[context.type]

  return `You are ${personality.name}, an AI code reviewer with a ${personality.tone} tone.

Context:
- Language: ${context.language}
- Description: ${context.description}
- Review Type: ${reviewType.name}

Task:
Review the following code with a focus on ${reviewType.focus}. Rate each aspect from 1-10 and provide specific suggestions for improvement.

Code to review:
\`\`\`${context.language}
${context.code}
\`\`\`

Please structure your review as follows:

1. Overall Rating (1-10)
2. Key Strengths
3. Areas for Improvement
4. Detailed Analysis:
   ${reviewType.ratingCriteria.map(criteria => `- ${criteria} (1-10)`).join('\n   ')}
5. Specific Suggestions
6. ${personality.emoji} ${personality.name}'s Take: [Your personality-driven summary]

Remember to:
- Be ${personality.tone}
- Provide actionable suggestions
- Include code examples where relevant
- Highlight both good practices and areas for improvement
- Make your review engaging and shareable`
}

export function generateSocialSharePrompt(review: Database['public']['Tables']['reviews']['Row']): string {
  const personality = personalities[review.personality as ReviewPersonality]
  
  return `Create a viral-worthy social media post about this code review:

Reviewer: ${personality.name}
Rating: ${review.rating}/10
Type: ${review.type}

Key Points:
${review.key_points}

Make it:
- Engaging and shareable
- Include relevant emojis
- Add a touch of ${personality.tone} humor
- Keep it under 280 characters for Twitter
- Include a call to action`
}

export function generateCodeSmellPrompt(code: string, language: string): string {
  return `Analyze the following code for code smells and anti-patterns:

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Please identify:
1. Code smells (e.g., long methods, duplicate code, magic numbers)
2. Anti-patterns
3. Potential refactoring opportunities
4. Complexity metrics
5. Maintainability issues

Provide specific examples and suggestions for improvement.`
}

export function generateViralHighlightPrompt(review: Database['public']['Tables']['reviews']['Row']): string {
  return `Create a viral-worthy "Code Roast" highlight for this review:

Reviewer: ${review.personality}
Rating: ${review.rating}/10
Type: ${review.type}

Make it:
- Hilariously brutal but constructive
- Include relevant programming memes
- Add dramatic code comparisons
- Keep it entertaining and educational
- Perfect for social media sharing`
} 