import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Activity {
  id: string
  type: string
  description: string
  time: string
  color: string
  icon: string
  user?: {
    name: string
    avatar: string
  }
}

interface TeamActivityProps {
  activities: Activity[]
}

const iconMap = {
  code: Code,
  trending: TrendingUp,
  users: Users,
  success: CheckCircle,
  alert: AlertCircle,
}

export function TeamActivity({ activities }: TeamActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = iconMap[activity.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                {activity.user ? (
                  <Avatar>
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>
                      {activity.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div
                    className={`p-2 rounded-full bg-${activity.color}-100 text-${activity.color}-500`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Card>
  )
} 