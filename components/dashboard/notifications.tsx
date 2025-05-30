import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Notification {
  id: string
  type: string
  message: string
  time: string
  color: string
  icon: string
  read: boolean
}

interface NotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  alert: AlertCircle,
  info: Info,
}

export function Notifications({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const Icon = iconMap[notification.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-start space-x-4 p-4 rounded-lg ${
                  notification.read ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div
                  className={`p-2 rounded-full bg-${notification.color}-100 text-${notification.color}-500`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">{notification.time}</p>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Card>
  )
} 