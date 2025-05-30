import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Replace with real data from database
  const notifications = [
    {
      id: '1',
      type: 'success',
      message: 'Code review completed successfully',
      time: '5 minutes ago',
      color: 'green',
      icon: 'success',
      read: false,
    },
    {
      id: '2',
      type: 'alert',
      message: 'New comment on your code review',
      time: '1 hour ago',
      color: 'blue',
      icon: 'alert',
      read: false,
    },
    {
      id: '3',
      type: 'info',
      message: 'System maintenance scheduled',
      time: '2 hours ago',
      color: 'purple',
      icon: 'info',
      read: true,
    },
  ]

  return NextResponse.json(notifications)
} 