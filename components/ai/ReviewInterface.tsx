'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Star,
  Bot,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  BarChart3,
  Zap,
  Shield,
  Code2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { copyToClipboard } from '@/lib/utils'

interface Suggestion {
  id: string
  before: string
  after: string
  explanation: string
  category: 'performance' | 'security' | 'style' | 'bug' | 'optimization'
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface Review {
  id: string
  content: string
  rating: number
  helpful: number
  notHelpful: number
  author: {
    name: string
    avatar: string
    type: 'ai' | 'human'
    model?: string
    personality?: string
  }
  timestamp: string
  suggestions: Suggestion[]
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
}

interface ReviewInterfaceProps {
  review: Review
  onVote: (type: 'helpful' | 'notHelpful') => void
  onShare: () => void
  className?: string
}

const categoryIcons = {
  performance: TrendingUp,
  security: Shield,
  style: Code2,
  bug: AlertCircle,
  optimization: Zap,
}

const severityColors = {
  low: 'info',
  medium: 'warning',
  high: 'destructive',
  critical: 'destructive',
} as const

export function ReviewInterface({
  review,
  onVote,
  onShare,
  className,
}: ReviewInterfaceProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isVoting, setIsVoting] = useState<'helpful' | 'notHelpful' | null>(null)

  const handleCopy = useCallback(async (text: string) => {
    try {
      await copyToClipboard(text)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }, [])

  const handleVote = useCallback(async (type: 'helpful' | 'notHelpful') => {
    setIsVoting(type)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      onVote(type)
      toast.success(`Marked as ${type}`)
    } catch (error) {
      toast.error('Failed to vote')
    } finally {
      setIsVoting(null)
    }
  }, [onVote])

  const handleExport = useCallback((format: 'pdf' | 'markdown' | 'json') => {
    // TODO: Implement export functionality
    toast(`Exporting as ${format.toUpperCase()}...`, { icon: '📄' })
  }, [])

  const filteredSuggestions = review.suggestions.filter(
    suggestion => filterCategory === 'all' || suggestion.category === filterCategory
  )

  const averageRating = Object.values(review.metrics).reduce((a, b) => a + b, 0) / Object.values(review.metrics).length

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={review.author.avatar}
                alt={review.author.name}
                className="w-12 h-12 rounded-full border-2 border-purple-500/20"
              />
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
                  review.author.type === 'ai'
                    ? 'bg-purple-500'
                    : 'bg-blue-500'
                }`}
              >
                {review.author.type === 'ai' ? (
                  <Bot className="h-4 w-4 text-white" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{review.author.name}</CardTitle>
                <Badge
                  variant={review.author.type === 'ai' ? 'default' : 'secondary'}
                >
                  {review.author.type === 'ai' ? 'AI Reviewer' : 'Human Reviewer'}
                </Badge>
                {review.author.model && (
                  <Badge variant="outline">{review.author.model}</Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-400">{review.timestamp}</p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="info">
                  <Clock className="h-3 w-3 mr-1" />
                  {review.estimatedFixTime}min fix
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">
              Suggestions ({review.suggestions.length})
            </TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-white leading-relaxed">{review.content}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(review.metrics).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="text-white">{value}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleVote('helpful')}
                  disabled={isVoting === 'helpful'}
                  className="flex items-center"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Helpful ({review.helpful})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleVote('notHelpful')}
                  disabled={isVoting === 'notHelpful'}
                  className="flex items-center"
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Not Helpful ({review.notHelpful})
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show More
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Code Suggestions ({filteredSuggestions.length})
              </h3>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="performance">Performance</option>
                  <option value="security">Security</option>
                  <option value="style">Style</option>
                  <option value="bug">Bug Fixes</option>
                  <option value="optimization">Optimization</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredSuggestions.map((suggestion) => {
                const CategoryIcon = categoryIcons[suggestion.category]
                return (
                  <Card
                    key={suggestion.id}
                    className={`cursor-pointer transition-colors ${
                      selectedSuggestion === suggestion.id
                        ? 'border-purple-500'
                        : 'hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedSuggestion(
                      selectedSuggestion === suggestion.id ? null : suggestion.id
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-5 w-5 text-purple-500" />
                          <Badge variant={severityColors[suggestion.severity]}>
                            {suggestion.severity}
                          </Badge>
                          <Badge variant="outline">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(suggestion.after)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-300 mb-3">
                        {suggestion.explanation}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-2">Before</p>
                          <pre className="text-xs bg-gray-800 p-3 rounded-lg overflow-x-auto">
                            <code className="text-red-300">{suggestion.before}</code>
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-2">After</p>
                          <pre className="text-xs bg-gray-800 p-3 rounded-lg overflow-x-auto">
                            <code className="text-green-300">{suggestion.after}</code>
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                    Code Quality Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {Math.round(averageRating)}%
                    </div>
                    <Progress value={averageRating} className="mb-4" />
                    <p className="text-sm text-gray-400">
                      Overall code quality assessment
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                    Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      review.suggestions.reduce((acc, s) => {
                        acc[s.severity] = (acc[s.severity] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).map(([severity, count]) => (
                      <div key={severity} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{severity}</span>
                        <Badge variant={severityColors[severity as keyof typeof severityColors]}>
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(review.metrics).map(([key, value]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-400 capitalize mb-2">
                        {key}
                      </h4>
                      <div className="text-2xl font-bold text-white mb-2">
                        {value}%
                      </div>
                      <Progress value={value} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <h3>Detailed Analysis</h3>
              <p>
                This code review provides a comprehensive analysis of your submission,
                focusing on key areas for improvement and best practices.
              </p>
              
              <h4>Key Findings</h4>
              <ul>
                <li>Code complexity is within acceptable ranges</li>
                <li>Security practices could be improved</li>
                <li>Performance optimizations are recommended</li>
                <li>Documentation coverage is adequate</li>
              </ul>

              <h4>Recommendations</h4>
              <p>
                Focus on implementing the high-priority suggestions first,
                particularly those related to security and performance.
                The estimated fix time for all suggestions is {review.estimatedFixTime} minutes.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 