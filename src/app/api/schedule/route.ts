import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Call backend API to schedule the post
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/social/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: data.content,
        platforms: data.platforms,
        schedule_time: data.scheduledTime,
        type: 'text',
        optimize_media: true,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to schedule post')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in schedule API route:', error)
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    )
  }
}
