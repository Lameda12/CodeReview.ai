import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Replace with real data from database
  const activities = [
    {
      id: '1',
      type: 'code',
      description: 'New code review submitted by Sarah Chen',
      time: '2 minutes ago',
      color: 'purple',
      icon: 'code',
      user: {
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
      },
    },
    {
      id: '2',
      type: 'trending',
      description: 'Code quality score improved by 5%',
      time: '15 minutes ago',
      color: 'green',
      icon: 'trending',
    },
    {
      id: '3',
      type: 'users',
      description: 'New team member joined',
      time: '1 hour ago',
      color: 'blue',
      icon: 'users',
      user: {
        name: 'John Doe',
        avatar: '/avatars/john.jpg',
      },
    },
  ]

  return NextResponse.json(activities)
} 