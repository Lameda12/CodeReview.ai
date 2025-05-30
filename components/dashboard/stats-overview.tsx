import { motion } from 'framer-motion'
import { Code, Star, Users, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StatsOverviewProps {
  stats: {
    totalReviews: number
    codeQualityScore: number
    teamMembers: number
    responseTime: number
    trends: {
      reviews: number[]
      quality: number[]
      response: number[]
    }
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: Code,
      trend: stats.trends.reviews[stats.trends.reviews.length - 1],
      color: 'purple',
    },
    {
      title: 'Code Quality Score',
      value: `${stats.codeQualityScore}%`,
      icon: Star,
      trend: stats.trends.quality[stats.trends.quality.length - 1],
      color: 'green',
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      trend: 0,
      color: 'blue',
    },
    {
      title: 'Response Time',
      value: `${stats.responseTime}m`,
      icon: Zap,
      trend: stats.trends.response[stats.trends.response.length - 1],
      color: 'orange',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                {stat.trend !== 0 && (
                  <p
                    className={`text-sm mt-1 ${
                      stat.trend > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.trend > 0 ? '+' : ''}
                    {stat.trend}%
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-500`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 