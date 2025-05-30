import { formatDistanceToNow } from 'date-fns'
import { ThumbsUp, MessageSquare, Eye } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  helpful_votes: number
}

interface Submission {
  id: string
  title: string
  description: string
  language: string
  created_at: string
  reviews: Review[]
}

interface SubmissionCardProps {
  submission: Submission
}

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  const totalReviews = submission.reviews?.length || 0
  const totalHelpfulVotes = submission.reviews?.reduce((sum, review) => sum + (review.helpful_votes || 0), 0) || 0

  return (
    <Link href={`/submission/${submission.id}`}>
      <div className="group relative p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500/50 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
              {submission.title}
            </h3>
            <p className="mt-2 text-sm text-gray-400 line-clamp-2">
              {submission.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
              {submission.language}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{totalReviews} reviews</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{totalHelpfulVotes} helpful</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  )
} 