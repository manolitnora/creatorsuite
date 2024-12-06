import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { RateLimiter } from 'limiter'

// Create a rate limiter: 3 requests per minute
const limiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: 'minute',
})

export async function POST(request: Request) {
  try {
    // Check rate limit
    const hasToken = await limiter.tryRemoveTokens(1)
    if (!hasToken) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          retryAfter: Math.ceil(limiter.msToNextReset() / 1000)
        },
        { status: 429 }
      )
    }

    const { platform, contentType, tone, topic, keywords, apiKey } = await request.json()

    // Basic validation
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required. Please add it in Settings.' },
        { status: 400 }
      )
    }

    // Initialize OpenAI with the provided key
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Construct the prompt based on content type and parameters
    const prompt = constructPrompt(platform, contentType, tone, topic, keywords)

    try {
      // Generate content using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional content creator skilled in writing engaging and effective content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const generatedContent = completion.choices[0].message.content

      return NextResponse.json({ content: generatedContent })
    } catch (error: any) {
      // Handle OpenAI specific errors
      if (error?.response?.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your API key in Settings.' },
          { status: 401 }
        )
      }
      throw error // Re-throw other errors to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again later.' },
      { status: 500 }
    )
  }
}

function constructPrompt(
  platform: string,
  contentType: string,
  tone: string,
  topic: string,
  keywords: string[] = []
): string {
  const keywordsStr = keywords?.length > 0 ? keywords.join(', ') : 'no specific keywords'
  
  if (platform === 'instagram') {
    const instagramPrompts = {
      reel: `Create content for an Instagram Reel about "${topic}".

Format the response in the following structure:
1. Hook (first 3 seconds to grab attention)
2. Script/Voiceover (15-60 seconds, with timestamps)
3. Visual Sequence (describe each scene/transition)
4. Caption (compelling, with emojis, max 2200 characters)
5. Music Suggestions (trending sounds or music types)
6. Hashtags (list of 20-30 relevant, trending hashtags)
7. Key Elements:
   - Transition suggestions
   - Text overlay timing
   - Camera angles/shots
   - Props or setup needed

Guidelines:
- Tone: ${tone}
- Keywords to incorporate: ${keywordsStr}
- Focus on quick, engaging transitions
- Include trending audio suggestions
- Optimize for loop-worthy content
- Add pattern interrupts every 2-3 seconds`,

      carousel: `Create content for an Instagram Carousel Post about "${topic}".

Format the response in the following structure:
1. Cover Slide (attention-grabbing first image description)
2. Slide Sequence (8-10 slides with content for each)
3. Caption (compelling, with emojis, max 2200 characters)
4. Hashtags (list of 20-30 relevant, trending hashtags)
5. Key Elements:
   - Design style suggestions
   - Color palette
   - Font pairing recommendations
   - Slide transitions
   - Save-worthy tips or insights

Guidelines:
- Tone: ${tone}
- Keywords to incorporate: ${keywordsStr}
- Start with a hook slide
- Each slide should flow naturally
- Include actionable insights
- End with a strong CTA`,

      single: `Create content for an Instagram Single Post about "${topic}".

Format the response in the following structure:
1. Image Description (what the photo/image should show)
2. Caption (compelling, with emojis, max 2200 characters)
3. Hashtags (list of 20-30 relevant, trending hashtags)
4. Key Elements:
   - Composition suggestions
   - Color palette
   - Props or setup needed
   - Editing tips

Guidelines:
- Tone: ${tone}
- Keywords to incorporate: ${keywordsStr}
- Focus on scroll-stopping visuals
- Write share-worthy caption
- Include relevant emojis
- Add strong call-to-action`,

      story: `Create content for an Instagram Story about "${topic}".

Format the response in the following structure:
1. Story Sequence (3-5 story frames)
2. Interactive Elements (polls, questions, sliders)
3. Text Overlay Content
4. Sticker Suggestions
5. Key Elements:
   - Music recommendations
   - Animation effects
   - Transition types
   - Engagement prompts

Guidelines:
- Tone: ${tone}
- Keywords to incorporate: ${keywordsStr}
- Include interactive elements
- Keep text minimal and readable
- Use engaging stickers
- Create tap-forward momentum`
    }

    return instagramPrompts[contentType as keyof typeof instagramPrompts] || instagramPrompts.single
  }
  
  return `Create content about "${topic}".
          Platform: ${platform}
          Content Type: ${contentType}
          Tone: ${tone}
          Keywords to include: ${keywordsStr}`
}
