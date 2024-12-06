import { NextResponse } from 'next/server'

// Temporary in-memory storage for scheduled content
let scheduledContent: {
  contentId: string;
  platforms: {
    platform: string;
    scheduledDate: string;
    status: 'scheduled' | 'posted' | 'draft';
  }[];
}[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contentId, platforms } = body

    // Validate request
    if (!contentId || !platforms || !Array.isArray(platforms)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Update or create schedule
    const existingIndex = scheduledContent.findIndex(
      (item) => item.contentId === contentId
    )

    if (existingIndex >= 0) {
      scheduledContent[existingIndex].platforms = platforms
    } else {
      scheduledContent.push({ contentId, platforms })
    }

    return NextResponse.json(
      { message: 'Content scheduled successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error scheduling content:', error)
    return NextResponse.json(
      { error: 'Failed to schedule content' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const contentId = searchParams.get('contentId')

  try {
    if (contentId) {
      const schedule = scheduledContent.find(
        (item) => item.contentId === contentId
      )
      return NextResponse.json(schedule || null)
    }

    return NextResponse.json(scheduledContent)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}
