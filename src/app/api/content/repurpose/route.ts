import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const platformPrompts = {
  instagram: "Optimize this content for Instagram, focusing on visual appeal and engagement. Include relevant hashtags and a captivating first line:",
  twitter: "Transform this content into a Twitter thread format, maintaining key points while being concise and engaging:",
  facebook: "Adapt this content for Facebook, emphasizing storytelling and community engagement:",
  linkedin: "Restructure this content for LinkedIn's professional audience, highlighting industry insights and expertise:",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, platform } = body

    if (!content || !platform || !platformPrompts[platform as keyof typeof platformPrompts]) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const prompt = platformPrompts[platform as keyof typeof platformPrompts]

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an expert content strategist who specializes in optimizing content for different social media platforms."
        },
        {
          role: "user",
          content: `${prompt}\n\nOriginal Content:\n${content}`
        }
      ],
      model: "gpt-3.5-turbo",
    })

    const optimizedContent = completion.choices[0].message.content

    return NextResponse.json({
      optimizedContent,
      platform
    })

  } catch (error) {
    console.error('Error repurposing content:', error)
    return NextResponse.json(
      { error: 'Failed to repurpose content' },
      { status: 500 }
    )
  }
}
