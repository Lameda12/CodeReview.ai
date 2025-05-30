'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
  Code,
  MessageSquare,
  Share2,
  Download,
  Printer,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  RefreshCw,
  Filter,
  Search,
  BookOpen,
  Zap,
} from 'lucide-react'
import { AdvancedEditor } from '@/components/ui/advanced-editor'
import { ReviewInterface } from '@/components/ai/ReviewInterface'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { copyToClipboard, downloadFile } from '@/lib/utils'

interface FileItem {
  id: string
  name: string
  language: string
  content: string
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
}

interface Submission {
  id: string
  title: string
  description: string
  language: string
  files: FileItem[]
  reviews: Review[]
  createdAt: string
  updatedAt: string
  status: 'pending' | 'reviewing' | 'completed'
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterReviews, setFilterReviews] = useState('all')

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSubmission: Submission = {
      id: params.id as string,
      title: 'React Authentication Component',
      description: 'A reusable authentication component with form validation and error handling.',
      language: 'typescript',
      files: [
        {
          id: '1',
          name: 'AuthForm.tsx',
          language: 'typescript',
          content: `import React, { useState } from 'react';
import { validateEmail, validatePassword } from './utils';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    
    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};`,
        },
        {
          id: '2',
          name: 'utils.ts',
          language: 'typescript',
          content: `export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};`,
        },
      ],
      reviews: [
        {
          id: '1',
          content: 'This is a well-structured authentication component with good separation of concerns. The form validation is implemented correctly, and the error handling provides clear feedback to users. However, there are several areas for improvement in terms of security, accessibility, and performance.',
          rating: 4,
          helpful: 15,
          notHelpful: 2,
          author: {
            name: 'CodeReview AI',
            avatar: '/ai-avatar.png',
            type: 'ai',
            model: 'GPT-4',
            personality: 'thorough',
          },
          timestamp: '2 hours ago',
          suggestions: [
            {
              id: '1',
              before: 'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
              after: 'const emailRegex = /^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;',
              explanation: 'Use a more robust email validation regex that follows RFC 5322 standards.',
              category: 'security',
              severity: 'medium',
            },
            {
              id: '2',
              before: 'return password.length >= 8;',
              after: 'return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/.test(password);',
              explanation: 'Strengthen password validation by requiring uppercase, lowercase, and numeric characters.',
              category: 'security',
              severity: 'high',
            },
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
            complexity: 75,
            maintainability: 85,
            performance: 90,
            security: 70,
            testability: 80,
            documentation: 65,
          },
          tags: ['react', 'typescript', 'forms', 'validation', 'authentication'],
          estimatedFixTime: 25,
        },
      ],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T12:45:00Z',
      status: 'completed',
    }

    setTimeout(() => {
      setSubmission(mockSubmission)
      setSelectedFileId(mockSubmission.files[0]?.id || null)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleVote = useCallback((reviewId: string, type: 'helpful' | 'notHelpful') => {
    if (!submission) return

    setSubmission(prev => {
      if (!prev) return null
      return {
        ...prev,
        reviews: prev.reviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                helpful: type === 'helpful' ? review.helpful + 1 : review.helpful,
                notHelpful: type === 'notHelpful' ? review.notHelpful + 1 : review.notHelpful,
              }
            : review
        ),
      }
    })
  }, [submission])

  const handleShare = useCallback(async () => {
    try {
      await copyToClipboard(window.location.href)
      toast.success('Review link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }, [])

  const handleExport = useCallback((format: 'pdf' | 'markdown' | 'json') => {
    if (!submission) return

    let content = ''
    let filename = `review-${submission.id}`
    let mimeType = 'text/plain'

    switch (format) {
      case 'markdown':
        content = `# Code Review: ${submission.title}

## Description
${submission.description}

## Files
${submission.files.map(file => `- ${file.name}`).join('\n')}

## Reviews
${submission.reviews.map(review => `
### ${review.author.name} (${review.rating}/5 stars)
${review.content}

**Suggestions:**
${review.suggestions.map(s => `- ${s.explanation}`).join('\n')}
`).join('\n')}
`
        filename += '.md'
        mimeType = 'text/markdown'
        break
      case 'json':
        content = JSON.stringify(submission, null, 2)
        filename += '.json'
        mimeType = 'application/json'
        break
      case 'pdf':
        toast('PDF export coming soon!', { icon: '📄' })
        return
    }

    downloadFile(content, filename, mimeType)
    toast.success(`Exported as ${format.toUpperCase()}`)
  }, [submission])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const filteredReviews = submission?.reviews.filter(review => {
    if (filterReviews === 'all') return true
    if (filterReviews === 'ai') return review.author.type === 'ai'
    if (filterReviews === 'human') return review.author.type === 'human'
    return true
  }) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading review...</p>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Review Not Found</h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{submission.title}</h1>
              <p className="text-sm text-gray-400">{submission.description}</p>
            </div>
            <Badge variant={submission.status === 'completed' ? 'success' : 'warning'}>
              {submission.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('markdown')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - File Tree */}
        <motion.div
          initial={false}
          animate={{ width: isLeftPanelCollapsed ? 60 : 300 }}
          className="bg-gray-800 border-r border-gray-700 overflow-hidden"
        >
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                {isLeftPanelCollapsed ? '' : 'Files'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
                className="h-6 w-6"
              >
                {isLeftPanelCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {!isLeftPanelCollapsed && (
            <div className="p-2">
              {submission.files.map(file => (
                <div
                  key={file.id}
                  className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                    selectedFileId === file.id
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedFileId(file.id)}
                >
                  <Code className="h-4 w-4 mr-2" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="h-full">
            <AdvancedEditor
              initialFiles={submission.files}
              readOnly
              className="h-full"
            />
          </div>
        </div>

        {/* Right Panel - Reviews */}
        <motion.div
          initial={false}
          animate={{ width: isRightPanelCollapsed ? 60 : 500 }}
          className="bg-gray-800 border-l border-gray-700 overflow-hidden"
        >
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                {isRightPanelCollapsed ? '' : 'Reviews'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
                className="h-6 w-6"
              >
                {isRightPanelCollapsed ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {!isRightPanelCollapsed && (
            <div className="h-[calc(100%-60px)] overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="p-3 border-b border-gray-700">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="reviews" className="p-3 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                      />
                    </div>
                    <select
                      value={filterReviews}
                      onChange={(e) => setFilterReviews(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                    >
                      <option value="all">All</option>
                      <option value="ai">AI</option>
                      <option value="human">Human</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {filteredReviews.map(review => (
                      <ReviewInterface
                        key={review.id}
                        review={review}
                        onVote={(type) => handleVote(review.id, type)}
                        onShare={handleShare}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="p-3 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Reviews</span>
                        <span className="text-white">{submission.reviews.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Rating</span>
                        <span className="text-white">
                          {(submission.reviews.reduce((acc, r) => acc + r.rating, 0) / submission.reviews.length).toFixed(1)}/5
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Suggestions</span>
                        <span className="text-white">
                          {submission.reviews.reduce((acc, r) => acc + r.suggestions.length, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Est. Fix Time</span>
                        <span className="text-white">
                          {submission.reviews.reduce((acc, r) => acc + r.estimatedFixTime, 0)}min
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                        Common Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="destructive">Security Vulnerabilities</Badge>
                        <Badge variant="warning">Performance Issues</Badge>
                        <Badge variant="info">Style Improvements</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 