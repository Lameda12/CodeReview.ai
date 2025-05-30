import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Replace with real data from database
  const achievements = [
    {
      id: '1',
      title: 'Code Master',
      description: 'Complete 100 code reviews',
      unlocked: true,
      progress: 100,
      icon: 'star',
    },
    {
      id: '2',
      title: 'Quick Responder',
      description: 'Average response time under 5 minutes',
      unlocked: false,
      progress: 75,
      icon: 'clock',
    },
    {
      id: '3',
      title: 'Quality Champion',
      description: 'Maintain 90% code quality score',
      unlocked: false,
      progress: 85,
      icon: 'trophy',
    },
  ]

  return NextResponse.json(achievements)
} 