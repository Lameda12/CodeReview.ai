export interface PromptConfig {
  language: string
  reviewStyle: 'encouraging' | 'detailed' | 'humorous' | 'strict' | 'beginner-friendly'
  focusAreas: string[]
  userLevel: 'beginner' | 'intermediate' | 'advanced'
}

export interface ReviewPrompt {
  systemPrompt: string
  userPrompt: string
  temperature: number
  maxTokens: number
}

const LANGUAGE_CONTEXTS = {
  typescript: {
    patterns: ['React components', 'type safety', 'async/await', 'error handling'],
    bestPractices: ['strict typing', 'proper interfaces', 'null checks', 'immutability'],
    commonIssues: ['any types', 'missing error handling', 'prop drilling', 'memory leaks'],
    frameworks: ['React', 'Next.js', 'Express', 'NestJS'],
  },
  javascript: {
    patterns: ['ES6+ features', 'promises', 'closures', 'prototypes'],
    bestPractices: ['const/let usage', 'arrow functions', 'destructuring', 'modules'],
    commonIssues: ['var usage', 'callback hell', 'global variables', 'loose equality'],
    frameworks: ['React', 'Vue', 'Angular', 'Node.js'],
  },
  python: {
    patterns: ['list comprehensions', 'decorators', 'context managers', 'generators'],
    bestPractices: ['PEP 8', 'type hints', 'docstrings', 'virtual environments'],
    commonIssues: ['mutable defaults', 'global state', 'bare except', 'string concatenation'],
    frameworks: ['Django', 'Flask', 'FastAPI', 'Pandas'],
  },
  java: {
    patterns: ['OOP principles', 'streams', 'lambdas', 'generics'],
    bestPractices: ['SOLID principles', 'proper exceptions', 'resource management', 'immutability'],
    commonIssues: ['resource leaks', 'null pointer exceptions', 'raw types', 'string concatenation'],
    frameworks: ['Spring', 'Hibernate', 'JUnit', 'Maven'],
  },
  go: {
    patterns: ['goroutines', 'channels', 'interfaces', 'error handling'],
    bestPractices: ['error checking', 'defer usage', 'context usage', 'package structure'],
    commonIssues: ['ignored errors', 'goroutine leaks', 'race conditions', 'improper context'],
    frameworks: ['Gin', 'Echo', 'Fiber', 'GORM'],
  },
  rust: {
    patterns: ['ownership', 'borrowing', 'lifetimes', 'pattern matching'],
    bestPractices: ['error handling with Result', 'iterator usage', 'trait bounds', 'cargo features'],
    commonIssues: ['unnecessary clones', 'unwrap usage', 'lifetime issues', 'unsafe blocks'],
    frameworks: ['Actix', 'Rocket', 'Tokio', 'Serde'],
  },
}

const REVIEW_PERSONALITIES = {
  encouraging: {
    tone: 'supportive and positive',
    approach: 'highlight strengths first, then gentle suggestions',
    language: 'encouraging and motivational',
  },
  detailed: {
    tone: 'thorough and analytical',
    approach: 'comprehensive analysis with detailed explanations',
    language: 'technical and precise',
  },
  humorous: {
    tone: 'light-hearted and witty',
    approach: 'use humor to make points memorable',
    language: 'casual with appropriate jokes',
  },
  strict: {
    tone: 'direct and uncompromising',
    approach: 'focus on standards and best practices',
    language: 'formal and authoritative',
  },
  'beginner-friendly': {
    tone: 'patient and educational',
    approach: 'explain concepts clearly with examples',
    language: 'simple and accessible',
  },
}

export function generateReviewPrompt(config: PromptConfig, code: string): ReviewPrompt {
  const languageContext = LANGUAGE_CONTEXTS[config.language as keyof typeof LANGUAGE_CONTEXTS]
  const personality = REVIEW_PERSONALITIES[config.reviewStyle]

  const systemPrompt = `You are an expert ${config.language} code reviewer with a ${personality.tone} personality. 
Your approach is to ${personality.approach} using ${personality.language} language.

LANGUAGE EXPERTISE:
- Patterns: ${languageContext?.patterns.join(', ')}
- Best Practices: ${languageContext?.bestPractices.join(', ')}
- Common Issues: ${languageContext?.commonIssues.join(', ')}
- Frameworks: ${languageContext?.frameworks.join(', ')}

USER LEVEL: ${config.userLevel}
${config.userLevel === 'beginner' ? 'Provide educational explanations and avoid overwhelming technical jargon.' : ''}
${config.userLevel === 'advanced' ? 'Focus on advanced patterns, performance optimizations, and architectural concerns.' : ''}

FOCUS AREAS: ${config.focusAreas.join(', ')}

REVIEW STRUCTURE:
1. Overall Assessment (2-3 sentences)
2. Strengths (what's done well)
3. Areas for Improvement (specific, actionable suggestions)
4. Code Quality Metrics (complexity, maintainability, performance, security, testability, documentation)
5. Specific Suggestions (before/after code examples)
6. Estimated Fix Time

RESPONSE FORMAT:
Provide a JSON response with the following structure:
{
  "content": "Main review content",
  "rating": 1-5,
  "suggestions": [
    {
      "before": "original code",
      "after": "improved code",
      "explanation": "why this is better",
      "category": "performance|security|style|bug|optimization",
      "severity": "low|medium|high|critical"
    }
  ],
  "metrics": {
    "complexity": 0-100,
    "maintainability": 0-100,
    "performance": 0-100,
    "security": 0-100,
    "testability": 0-100,
    "documentation": 0-100
  },
  "tags": ["relevant", "tags"],
  "estimatedFixTime": minutes
}`

  const userPrompt = `Please review this ${config.language} code:

\`\`\`${config.language}
${code}
\`\`\`

Focus particularly on: ${config.focusAreas.join(', ')}

Provide a ${config.reviewStyle} review appropriate for a ${config.userLevel} developer.`

  return {
    systemPrompt,
    userPrompt,
    temperature: config.reviewStyle === 'humorous' ? 0.8 : 0.3,
    maxTokens: 2000,
  }
}

export function generateSecurityFocusedPrompt(language: string, code: string): ReviewPrompt {
  return {
    systemPrompt: `You are a cybersecurity expert specializing in ${language} code security analysis.
Focus exclusively on security vulnerabilities, potential attack vectors, and security best practices.

SECURITY FOCUS AREAS:
- Input validation and sanitization
- Authentication and authorization
- Data encryption and protection
- SQL injection prevention
- XSS prevention
- CSRF protection
- Secure coding patterns
- Dependency vulnerabilities

Provide specific, actionable security recommendations with code examples.`,
    userPrompt: `Analyze this ${language} code for security vulnerabilities:

\`\`\`${language}
${code}
\`\`\`

Identify all potential security issues and provide secure alternatives.`,
    temperature: 0.1,
    maxTokens: 1500,
  }
}

export function generatePerformancePrompt(language: string, code: string): ReviewPrompt {
  return {
    systemPrompt: `You are a performance optimization expert for ${language}.
Focus on identifying performance bottlenecks, memory usage issues, and optimization opportunities.

PERFORMANCE AREAS:
- Algorithm complexity
- Memory usage and leaks
- Database query optimization
- Caching strategies
- Async/await patterns
- Bundle size optimization
- Runtime performance
- Scalability concerns

Provide specific performance improvements with measurable impact.`,
    userPrompt: `Analyze this ${language} code for performance optimization opportunities:

\`\`\`${language}
${code}
\`\`\`

Suggest specific optimizations with expected performance gains.`,
    temperature: 0.2,
    maxTokens: 1500,
  }
}

export function generateArchitecturePrompt(language: string, code: string): ReviewPrompt {
  return {
    systemPrompt: `You are a software architecture expert specializing in ${language} applications.
Focus on code structure, design patterns, maintainability, and scalability.

ARCHITECTURE AREAS:
- Design patterns and principles
- Code organization and structure
- Separation of concerns
- Dependency management
- Testability and modularity
- Scalability considerations
- Maintainability factors
- Technical debt assessment

Provide architectural improvements and refactoring suggestions.`,
    userPrompt: `Review this ${language} code from an architectural perspective:

\`\`\`${language}
${code}
\`\`\`

Focus on structure, design patterns, and long-term maintainability.`,
    temperature: 0.3,
    maxTokens: 1800,
  }
}

export const PROMPT_TEMPLATES = {
  generateReviewPrompt,
  generateSecurityFocusedPrompt,
  generatePerformancePrompt,
  generateArchitecturePrompt,
} 