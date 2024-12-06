import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // Initialize OpenAI with the provided key
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Test the API key with a simple completion
    await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'gpt-3.5-turbo',
      max_tokens: 5,
    })

    return NextResponse.json({ message: 'API key is valid' })
  } catch (error: any) {
    console.error('Error testing OpenAI key:', error)
    
    // Check for specific OpenAI API errors
    if (error?.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to verify API key' },
      { status: 500 }
    )
  }
}
