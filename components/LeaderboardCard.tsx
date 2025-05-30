'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, ThumbsUp } from 'lucide-react'
import { Database } from '@/types/database'
import { ShareButton } from './ShareButton'

type Profile = Database['public']['Tables']['profiles']['Row']

interface LeaderboardCardProps {
  profile: Profile
  rank: number
  type: 'developer' | 'reviewer'
  stats: {
    reputation: number
    submissions?: number
    reviews?: number
    helpfulVotes?: number
  }
}

const rankColors = {
  1: 'bg-yellow-500/20 text-yellow-400',
  2: 'bg-gray-400/20 text-gray-300',
  3: 'bg-amber-600/20 text-amber-500',
}

const badges = {
  developer: {
    'Top 1': '🏆',
    'Code Master': '👨‍💻',
    'Bug Hunter': '🐛',
    'Clean Code': '✨',
  },
  reviewer: {
    'Top Reviewer': '⭐',
    'Helpful Hero': '🦸',
    'Code Mentor': '👨‍🏫',
    'Roast Master': '🔥',
  },
}

export function LeaderboardCard({ profile, rank, type, stats }: LeaderboardCardProps) {
  const rankColor = rankColors[rank as keyof typeof rankColors] || 'bg-gray-700/20 text-gray-400'
  const userBadges = type === 'developer' ? badges.developer : badges.reviewer

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
      className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700"
    >
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${rankColor} flex items-center justify-center text-xl font-bold`}>
          {rank}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-300">
                  {profile.username[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {profile.username}
              </h3>
              <p className="text-sm text-gray-400">
                {profile.full_name}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Reputation</p>
                <p className="text-lg font-semibold text-white">{stats.reputation}</p>
              </div>
            </div>

            {type === 'developer' ? (
              <>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Submissions</p>
                    <p className="text-lg font-semibold text-white">{stats.submissions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Reviews</p>
                    <p className="text-lg font-semibold text-white">{stats.reviews}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Helpful</p>
                    <p className="text-lg font-semibold text-white">{stats.helpfulVotes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Reviews</p>
                    <p className="text-lg font-semibold text-white">{stats.reviews}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Badges */}
          <div className="mt-4 flex items-center gap-2">
            {Object.entries(userBadges).map(([name, emoji]) => (
              <span
                key={name}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300"
                title={name}
              >
                {emoji} {name}
              </span>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 rounded-full bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.reputation / 1000) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {stats.reputation} / 1000 reputation
            </p>
          </div>
        </div>

        {/* Share Button */}
        <ShareButton
          title={`${profile.username} is ranked #${rank} on the CodeReview.ai leaderboard!`}
          text={`Check out ${profile.username}'s amazing work on CodeReview.ai! 🚀`}
          url={`/profiles/${profile.username}`}
        />
      </div>
    </motion.div>
  )
} 