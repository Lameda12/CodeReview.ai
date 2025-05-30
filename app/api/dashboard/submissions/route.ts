import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Replace with real data from database
  const submissions = [
    {
      id: '1',
      title: 'Authentication System',
      language: 'TypeScript',
      status: 'completed',
      createdAt: '2 hours ago',
      updatedAt: '1 hour ago',
    },
    {
      id: '2',
      title: 'API Integration',
      language: 'Python',
      status: 'in_progress',
      createdAt: '1 day ago',
      updatedAt: '12 hours ago',
    },
    {
      id: '3',
      title: 'Database Migration',
      language: 'SQL',
      status: 'pending',
      createdAt: '3 days ago',
      updatedAt: '2 days ago',
    },
  ]

  return NextResponse.json(submissions)
} 