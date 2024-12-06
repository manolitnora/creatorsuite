import { NextResponse } from 'next/server'

// Temporary in-memory storage
let savedContent: Array<{
  id: string;
  title: string;
  content: string;
  contentType: string;
  status: string;
  tags: string[];
  createdAt: string;
  platforms?: {
    platform: string;
    scheduledDate?: string;
    status: 'scheduled' | 'posted' | 'draft';
  }[];
  analytics?: {
    views: number;
    engagement: number;
    clicks: number;
  };
}> = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, contentType, status, tags } = body

    if (!title || !content || !contentType || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newContent = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      contentType,
      status,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      platforms: [],
      analytics: {
        views: 0,
        engagement: 0,
        clicks: 0
      }
    }

    savedContent.push(newContent)

    return NextResponse.json(newContent)
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json(savedContent)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}
