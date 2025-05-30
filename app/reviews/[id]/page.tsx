import { createClient } from '@/lib/supabase/server'
import { AIReviewCard } from '@/components/AIReviewCard'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

type Review = Database['public']['Tables']['reviews']['Row']
type Submission = Database['public']['Tables']['code_submissions']['Row']

interface PageProps {
  params: {
    id: string
  }
}

async function updateVote(reviewId: string, type: 'helpful' | 'funny' | 'accurate', currentVotes: number) {
  'use server'
  
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('reviews')
    .update({
      [`${type}_votes`]: currentVotes + 1,
    })
    .eq('id', reviewId)

  if (error) {
    throw new Error('Failed to update vote')
  }
}

export default async function ReviewPage({ params }: PageProps) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the submission
  const { data: submission, error: submissionError } = await supabase
    .from('code_submissions')
    .select('*')
    .eq('id', params.id)
    .single()

  if (submissionError || !submission) {
    notFound()
  }

  // Get all reviews for this submission
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .eq('submission_id', params.id)
    .order('created_at', { ascending: false })

  if (reviewsError) {
    throw new Error('Failed to fetch reviews')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{submission.title}</h1>
          <p className="text-gray-400">{submission.description}</p>
        </div>

        <div className="space-y-6">
          {reviews.map((review: Review) => (
            <AIReviewCard
              key={review.id}
              review={review}
              onVote={async (type) => {
                await updateVote(review.id, type, review[`${type}_votes`])
              }}
              onShare={() => {
                if (typeof window !== 'undefined') {
                  navigator.share({
                    title: `${submission.title} - ${review.type} Review`,
                    text: review.summary,
                    url: window.location.href,
                  })
                }
              }}
              onReport={() => {
                // TODO: Implement report functionality
                console.log('Report review:', review.id)
              }}
            />
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No reviews yet. Be the first to review this submission!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 