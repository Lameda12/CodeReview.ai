import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Clock, Zap, Trophy, Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
  progress: number
  icon: string
}

interface AchievementsProps {
  achievements: Achievement[]
}

const iconMap = {
  star: Star,
  clock: Clock,
  zap: Zap,
  trophy: Trophy,
  target: Target,
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {achievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div
                  className={`p-2 rounded-full ${
                    achievement.unlocked
                      ? 'bg-green-100 text-green-500'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="text-sm font-medium leading-none">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {achievement.description}
                    </p>
                  </div>
                  <Progress value={achievement.progress} />
                  <p className="text-xs text-gray-500">
                    {achievement.progress}% Complete
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Card>
  )
} 