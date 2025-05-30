import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Submission {
  id: string
  title: string
  language: string
  status: 'completed' | 'in_progress' | 'pending'
  createdAt: string
  updatedAt: string
}

interface RecentSubmissionsProps {
  submissions: Submission[]
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'green',
    label: 'Completed',
  },
  in_progress: {
    icon: Clock,
    color: 'blue',
    label: 'In Progress',
  },
  pending: {
    icon: AlertCircle,
    color: 'orange',
    label: 'Pending',
  },
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {submissions.map((submission, index) => {
            const status = statusConfig[submission.status]
            const Icon = status.icon
            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full bg-${status.color}-100 text-${status.color}-500`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium leading-none">
                      {submission.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{submission.language}</Badge>
                      <Badge
                        variant="secondary"
                        className={`bg-${status.color}-100 text-${status.color}-500`}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Created {submission.createdAt}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated {submission.updatedAt}
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