import useSWR from 'swr'
import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'

interface DashboardStats {
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

interface Activity {
  id: string
  type: string
  description: string
  time: string
  color: string
  icon: string
}

interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
  progress: number
  icon: string
}

interface Submission {
  id: string
  title: string
  language: string
  status: 'completed' | 'in_progress' | 'pending'
  createdAt: string
  updatedAt: string
}

interface Notification {
  id: string
  type: string
  message: string
  time: string
  color: string
  icon: string
  read: boolean
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useDashboard() {
  const [isLoading, setIsLoading] = useState(false)

  // Fetch dashboard stats
  const { data: stats, error: statsError, mutate: mutateStats } = useSWR<DashboardStats>(
    '/api/dashboard/stats',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  // Fetch recent activities
  const { data: activities, error: activitiesError, mutate: mutateActivities } = useSWR<Activity[]>(
    '/api/dashboard/activities',
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
    }
  )

  // Fetch achievements
  const { data: achievements, error: achievementsError, mutate: mutateAchievements } = useSWR<Achievement[]>(
    '/api/dashboard/achievements',
    fetcher
  )

  // Fetch recent submissions
  const { data: submissions, error: submissionsError, mutate: mutateSubmissions } = useSWR<Submission[]>(
    '/api/dashboard/submissions',
    fetcher,
    {
      refreshInterval: 15000, // Refresh every 15 seconds
    }
  )

  // Fetch notifications
  const { data: notifications, error: notificationsError, mutate: mutateNotifications } = useSWR<Notification[]>(
    '/api/dashboard/notifications',
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
    }
  )

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      setIsLoading(true)
      await fetch(`/api/dashboard/notifications/${notificationId}/read`, {
        method: 'POST',
      })
      await mutateNotifications()
      toast.success('Notification marked as read')
    } catch (error) {
      toast.error('Failed to mark notification as read')
    } finally {
      setIsLoading(false)
    }
  }, [mutateNotifications])

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      setIsLoading(true)
      await fetch('/api/dashboard/notifications/read-all', {
        method: 'POST',
      })
      await mutateNotifications()
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all notifications as read')
    } finally {
      setIsLoading(false)
    }
  }, [mutateNotifications])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setIsLoading(true)
      await fetch(`/api/dashboard/notifications/${notificationId}`, {
        method: 'DELETE',
      })
      await mutateNotifications()
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    } finally {
      setIsLoading(false)
    }
  }, [mutateNotifications])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    try {
      setIsLoading(true)
      await Promise.all([
        mutateStats(),
        mutateActivities(),
        mutateAchievements(),
        mutateSubmissions(),
        mutateNotifications(),
      ])
      toast.success('Dashboard refreshed')
    } catch (error) {
      toast.error('Failed to refresh dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [
    mutateStats,
    mutateActivities,
    mutateAchievements,
    mutateSubmissions,
    mutateNotifications,
  ])

  return {
    stats,
    activities,
    achievements,
    submissions,
    notifications,
    isLoading,
    errors: {
      stats: statsError,
      activities: activitiesError,
      achievements: achievementsError,
      submissions: submissionsError,
      notifications: notificationsError,
    },
    actions: {
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      refreshAll,
    },
  }
} 