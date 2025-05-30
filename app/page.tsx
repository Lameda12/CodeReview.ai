'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code,
  Upload,
  TrendingUp,
  Users,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Github,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatTimeAgo } from '@/lib/utils'

const stats = [
  {
    name: 'Total Reviews',
    value: '12,847',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Code,
  },
  {
    name: 'Active Users',
    value: '2,847',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    name: 'Avg Review Time',
    value: '2.4 min',
    change: '-15%',
    changeType: 'positive' as const,
    icon: Clock,
  },
  {
    name: 'Satisfaction',
    value: '4.8/5',
    change: '+0.2',
    changeType: 'positive' as const,
    icon: Star,
  },
]

const recentReviews = [
  {
    id: '1',
    title: 'React Authentication Component',
    language: 'TypeScript',
    rating: 4,
    reviewCount: 3,
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    author: 'john_dev',
    tags: ['react', 'auth', 'security'],
  },
  {
    id: '2',
    title: 'Python Data Processing Pipeline',
    language: 'Python',
    rating: 5,
    reviewCount: 2,
    status: 'reviewing',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    author: 'data_scientist',
    tags: ['python', 'data', 'pipeline'],
  },
  {
    id: '3',
    title: 'Go Microservice API',
    language: 'Go',
    rating: 4,
    reviewCount: 1,
    status: 'pending',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    author: 'backend_dev',
    tags: ['go', 'api', 'microservice'],
  },
]

const features = [
  {
    name: 'Multi-AI Review',
    description: 'Get reviews from multiple AI models for comprehensive feedback',
    icon: Sparkles,
    color: 'text-purple-500',
  },
  {
    name: 'Security Analysis',
    description: 'Advanced security vulnerability detection and recommendations',
    icon: Shield,
    color: 'text-red-500',
  },
  {
    name: 'Performance Insights',
    description: 'Identify bottlenecks and optimization opportunities',
    icon: Zap,
    color: 'text-yellow-500',
  },
  {
    name: 'Code Quality Metrics',
    description: 'Detailed metrics on maintainability, complexity, and more',
    icon: BarChart3,
    color: 'text-blue-500',
  },
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6"
            >
              AI-Powered{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Code Reviews
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Get intelligent feedback from multiple AI models. Improve your code quality,
              security, and performance with detailed reviews and actionable suggestions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="text-lg px-8 py-3">
                <Link href="/submit">
                  <Upload className="h-5 w-5 mr-2" />
                  Submit Code for Review
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                <Link href="/reviews">
                  <Code className="h-5 w-5 mr-2" />
                  Browse Reviews
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className={`text-sm ${
                            stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {stat.change} from last month
                          </p>
                        </div>
                        <div className="p-3 bg-purple-600/20 rounded-lg">
                          <Icon className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Recent Reviews</h2>
            <Button variant="outline" asChild>
              <Link href="/reviews">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-purple-500/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                        <p className="text-sm text-gray-400">by {review.author}</p>
                      </div>
                      <Badge
                        variant={
                          review.status === 'completed'
                            ? 'success'
                            : review.status === 'reviewing'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {review.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{review.language}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {review.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{review.reviewCount} reviews</span>
                        <span>{formatTimeAgo(review.timestamp)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced AI capabilities to help you write better, more secure, and performant code
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:border-purple-500/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="inline-flex p-3 bg-gray-800 rounded-lg">
                          <Icon className={`h-8 w-8 ${feature.color}`} />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Improve Your Code?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who trust our AI-powered code reviews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-3">
                <Link href="/submit">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 mr-2" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
