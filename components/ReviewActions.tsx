'use client'

import { useState } from 'react'
import { ThumbsUp, Share2, Flag } from 'lucide-react'
import { Database } from '@/types/database'

type Review = Database['public']['Tables']['reviews']['Row']

interface ReviewActionsProps {
  review: Review
  onVote: (type: 'helpful' | 'funny' | 'accurate') => Promise<void>
  onShare: () => void
  onReport: () => void
}

export function ReviewActions({ review, onVote, onShare, onReport }: ReviewActionsProps) {
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (type: 'helpful' | 'funny' | 'accurate') => {
    if (isVoting) return
    setIsVoting(true)
    try {
      await onVote(type)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleVote('helpful')}
        disabled={isVoting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50"
      >
        <ThumbsUp className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-400">
          {review.helpful_votes || 0}
        </span>
      </button>

      <button
        onClick={() => handleVote('funny')}
        disabled={isVoting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50"
      >
        <span className="text-sm text-gray-400">😂</span>
        <span className="text-sm text-gray-400">
          {review.funny_votes || 0}
        </span>
      </button>

      <button
        onClick={() => handleVote('accurate')}
        disabled={isVoting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50"
      >
        <span className="text-sm text-gray-400">🎯</span>
        <span className="text-sm text-gray-400">
          {review.accurate_votes || 0}
        </span>
      </button>

      <button
        onClick={onShare}
        className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        title="Share review"
      >
        <Share2 className="h-5 w-5 text-gray-400" />
      </button>

      <button
        onClick={onReport}
        className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        title="Report review"
      >
        <Flag className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  )
} 