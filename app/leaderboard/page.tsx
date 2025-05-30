import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { LeaderboardCard } from '@/components/LeaderboardCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Submission = Database['public']['Tables']['code_submissions']['Row']
type Review = Database['public']['Tables']['reviews']['Row']

async function getTopDevelopers() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('reputation', { ascending: false })
    .limit(10)

  return profiles || []
}

async function getTopReviewers() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('reviewer_id, profiles!inner(*)')
    .order('helpful_votes', { ascending: false })
    .limit(10)

  return reviews?.map(review => review.profiles) || []
}

async function getTrendingSubmissions() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: submissions } = await supabase
    .from('code_submissions')
    .select(`
      *,
      profiles:user_id (*),
      reviews (*)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return submissions || []
}

async function getHallOfShame() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      code_submissions!inner (
        *,
        profiles:user_id (*)
      )
    `)
    .eq('personality', 'roaster')
    .order('funny_votes', { ascending: false })
    .limit(5)

  return reviews || []
}

export default async function LeaderboardPage() {
  const [topDevelopers, topReviewers, trendingSubmissions, hallOfShame] = await Promise.all([
    getTopDevelopers(),
    getTopReviewers(),
    getTrendingSubmissions(),
    getHallOfShame(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Leaderboard</h1>

        <Tabs defaultValue="developers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="developers">Top Developers</TabsTrigger>
            <TabsTrigger value="reviewers">Top Reviewers</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="hall-of-shame">Hall of Shame</TabsTrigger>
          </TabsList>

          <TabsContent value="developers" className="space-y-4">
            {topDevelopers.map((profile, index) => (
              <LeaderboardCard
                key={profile.id}
                profile={profile}
                rank={index + 1}
                type="developer"
                stats={{
                  reputation: profile.reputation,
                  submissions: 0, // TODO: Add submission count
                  reviews: 0, // TODO: Add review count
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="reviewers" className="space-y-4">
            {topReviewers.map((profile, index) => (
              <LeaderboardCard
                key={profile.id}
                profile={profile}
                rank={index + 1}
                type="reviewer"
                stats={{
                  reputation: profile.reputation,
                  helpfulVotes: 0, // TODO: Add helpful votes count
                  reviews: 0, // TODO: Add review count
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            {trendingSubmissions.map((submission, index) => (
              <div
                key={submission.id}
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">
                      {submission.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      by {submission.profiles.username}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        {submission.language}
                      </span>
                      <span className="text-sm text-gray-400">
                        {submission.reviews.length} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="hall-of-shame" className="space-y-4">
            {hallOfShame.map((review, index) => (
              <div
                key={review.id}
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">
                      {review.code_submissions.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      by {review.code_submissions.profiles.username}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        😂 {review.funny_votes} laughs
                      </span>
                      <span className="text-sm text-gray-400">
                        Rating: {review.rating}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 