'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Activity, 
  Bell, 
  Code, 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'

// StatCard Component
export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'purple' 
}: { 
  title: string
  value: number | string
  icon: any
  trend?: number
  color?: string
}) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (inView && typeof value === 'number') {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500/50 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">
            {typeof value === 'number' ? count.toLocaleString() : value}
          </h3>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
      </div>
    </motion.div>
  )
}

// ActivityFeed Component
export const ActivityFeed = ({ activities }: { activities: any[] }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500/50 transition-colors duration-200"
        >
          <div className={`p-2 rounded-lg bg-${activity.color}-500/10`}>
            {activity.icon}
          </div>
          <div className="flex-1">
            <p className="text-white">{activity.description}</p>
            <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// QuickActions Component
export const QuickActions = () => {
  const actions = [
    { icon: Code, label: 'New Review', color: 'purple' },
    { icon: Star, label: 'Favorites', color: 'yellow' },
    { icon: Users, label: 'Team', color: 'blue' },
    { icon: Zap, label: 'Quick Fix', color: 'green' },
  ]

  return (
    <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-full bg-${action.color}-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-200`}
        >
          <action.icon className="h-6 w-6" />
        </motion.button>
      ))}
    </div>
  )
}

// NotificationCenter Component
export const NotificationCenter = ({ notifications }: { notifications: any[] }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500/50 transition-colors duration-200"
      >
        <Bell className="h-6 w-6 text-gray-400" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 rounded-lg bg-gray-800/95 backdrop-blur-lg border border-gray-700 shadow-xl"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg bg-${notification.color}-500/10`}>
                      {notification.icon}
                    </div>
                    <div>
                      <p className="text-white text-sm">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// AchievementBadge Component
export const AchievementBadge = ({ 
  title, 
  description, 
  icon: Icon, 
  unlocked, 
  progress 
}: { 
  title: string
  description: string
  icon: any
  unlocked: boolean
  progress: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative p-6 rounded-xl ${
        unlocked 
          ? 'bg-purple-500/10 border-purple-500/50' 
          : 'bg-gray-800/50 border-gray-700'
      } backdrop-blur-lg border`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${
          unlocked ? 'bg-purple-500/20' : 'bg-gray-700/50'
        }`}>
          <Icon className={`h-6 w-6 ${
            unlocked ? 'text-purple-500' : 'text-gray-400'
          }`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      {!unlocked && (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-gray-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-purple-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{progress}% complete</p>
        </div>
      )}
    </motion.div>
  )
}

// RecentSubmissions Component
export const RecentSubmissions = ({ submissions }: { submissions: any[] }) => {
  return (
    <div className="space-y-4">
      {submissions.map((submission, index) => (
        <motion.div
          key={submission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500/50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{submission.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{submission.language}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                submission.status === 'completed' 
                  ? 'bg-green-500/20 text-green-500'
                  : submission.status === 'in_progress'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-blue-500/20 text-blue-500'
              }`}>
                {submission.status}
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// TrendChart Component
export const TrendChart = ({ data, title }: { data: any[], title: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-64">
        {/* Chart implementation will go here */}
      </div>
    </motion.div>
  )
} 