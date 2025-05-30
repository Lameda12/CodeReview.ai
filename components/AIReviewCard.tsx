'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, Share2, Copy, ChevronDown, ChevronUp, Flag } from 'lucide-react'
import { Database } from '@/types/database'
import { ReviewActions } from './ReviewActions'

type Review = Database['public']['Tables']['reviews']['Row']

interface AIReviewCardProps {
  review: Review
  onVote: (type: 'helpful' | 'funny' | 'accurate') => Promise<void>
  onShare: () => void
  onReport: () => void
}

const modelBadges = {
  'gpt-4': {
    name: 'GPT-4',
    color: 'bg-purple-500/10 text-purple-400',
  },
  'claude-3-opus': {
    name: 'Claude 3',
    color: 'bg-blue-500/10 text-blue-400',
  },
} as const

const personalityEmojis = {
  mentor: '🤖',
  roaster: '😈',
  guardian: '🛡️',
  optimizer: '⚡',
  professor: '📚',
} as const

export function AIReviewCard({ review, onVote, onShare, onReport }: AIReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const modelBadge = modelBadges[review.model]
  const personalityEmoji = personalityEmojis[review.personality]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(review.summary)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{personalityEmoji}</span>
            <h3 className="text-lg font-semibold text-white">
              {review.type.charAt(0).toUpperCase() + review.type.slice(1)} Review
            </h3>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${modelBadge.color}`}>
              {modelBadge.name}
            </span>
            <span className="text-sm text-gray-400">
              Rating: {review.rating}/10
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Summary */}
      <p className="mt-4 text-gray-300 line-clamp-3">
        {review.summary}
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4">
        <ReviewActions
          review={review}
          onVote={onVote}
          onShare={onShare}
          onReport={onReport}
        />
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          title="Copy review"
        >
          <Copy className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 space-y-6 overflow-hidden"
          >
            {/* Key Points */}
            <div>
              <h4 className="text-sm font-medium text-gray-200">Key Points</h4>
              <ul className="mt-2 space-y-2">
                {review.key_points.map((point: string, index: number) => (
                  <li key={index} className="text-sm text-gray-400">
                    • {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Analysis */}
            <div>
              <h4 className="text-sm font-medium text-gray-200">Detailed Analysis</h4>
              <div className="mt-2 space-y-2">
                {Object.entries(review.detailed_analysis).map(([criteria, rating]) => (
                  <div key={criteria} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{criteria}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-gray-700">
                        <div
                          className="h-full rounded-full bg-purple-500"
                          style={{ width: `${(rating / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{rating}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-sm font-medium text-gray-200">Suggestions</h4>
              <ul className="mt-2 space-y-2">
                {review.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-sm text-gray-400">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Smells */}
            {review.code_smells.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-200">Code Smells</h4>
                <ul className="mt-2 space-y-2">
                  {review.code_smells.map((smell: string, index: number) => (
                    <li key={index} className="text-sm text-gray-400">
                      • {smell}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 