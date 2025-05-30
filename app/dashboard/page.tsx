'use client'

import { motion } from 'framer-motion'
import { useDashboard } from '@/hooks/useDashboard'
import { 
  ActivityFeed,
  Achievements,
  Notifications,
  RecentSubmissions,
  StatsOverview,
  TeamActivity
} from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { RefreshCw, Bell } from 'lucide-react'

export default function DashboardPage() {
  const {
    stats,
    activities,
    achievements,
    submissions,
    notifications,
    isLoading,
    errors,
    actions
  } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (errors.stats || errors.activities || errors.achievements || errors.submissions || errors.notifications) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Dashboard</h2>
        <Button onClick={actions.refreshAll}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={actions.refreshAll}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={actions.markAllNotificationsAsRead}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <StatsOverview stats={stats} />
        </motion.div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <RecentSubmissions submissions={submissions} />
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Notifications
            notifications={notifications}
            onMarkAsRead={actions.markNotificationAsRead}
            onDelete={actions.deleteNotification}
          />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <ActivityFeed activities={activities} />
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Achievements achievements={achievements} />
        </motion.div>

        {/* Team Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-3"
        >
          <TeamActivity activities={activities} />
        </motion.div>
      </div>
    </div>
  )
} 