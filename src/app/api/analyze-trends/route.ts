import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const { platform, apiKey } = await request.json()

    if (!platform || !apiKey) {
      return NextResponse.json(
        { error: 'Platform and API key are required' },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Create a prompt for analyzing current trends
    const getPromptForPlatform = (platform: string) => {
      if (platform === 'instagram') {
        return `Analyze current high-performing Instagram content patterns. Focus on specific, data-driven insights about:

        1. Content Structure Insights:
        For each content type (Reels, Carousels, Single Posts, Stories), analyze:
        - Opening hooks that drive highest watch time
        - Optimal content length and pacing
        - Most effective transitions and sequences
        - Caption structures with best engagement
        - Call-to-action patterns that convert

        2. Visual Style Insights:
        - Current color palettes driving engagement
        - Text overlay styles and placement
        - Video transition techniques
        - Image composition patterns
        - Editing styles and filters

        3. Engagement Mechanics:
        - Best performing hashtag combinations
        - Optimal posting times and frequencies
        - Comment-triggering caption techniques
        - Save-worthy content characteristics
        - Share-triggering elements

        Return exactly 5 highly specific, data-backed insights formatted as a JSON array with this structure:
        {
          "trends": [
            {
              "title": "Specific technique or pattern (e.g., '3-Point Hook Structure in Reels')",
              "description": "Detailed breakdown of the pattern and why it works",
              "engagementRate": "Current engagement metrics",
              "growthRate": "Growth in adoption and performance",
              "category": "Content Type (Reels/Stories/Posts/Carousels)",
              "suggestedFormat": "Step-by-step implementation guide"
            }
          ]
        }

        Make each insight extremely specific and immediately actionable. For example:
        Instead of: "Reels are performing well"
        Say: "5-Second Pattern Interrupt Hook Structure: Start with question (2s) → pattern interrupt (1s) → value proposition (2s)"

        Instead of: "Use good lighting"
        Say: "Ring Light + Window Setup: 45° angle ring light + natural window light at 90° for depth"

        Focus on current patterns that are:
        1. Measurable and specific
        2. Immediately implementable
        3. Proven by engagement data
        4. Platform-optimized
        5. Aligned with algorithm preferences`
      }
      
      return `Analyze current trending topics and content formats on ${platform}. For each trend, provide:
      1. Title
      2. Description
      3. Engagement rate
      4. Growth rate
      5. Category
      6. Suggested format
      
      Focus on trends that follow the 80/20 rule for maximum impact. Return 5 trending topics formatted as a JSON array.`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert Instagram content strategist and data analyst who understands:
          - Content performance metrics and patterns
          - Platform-specific best practices
          - Technical aspects of content creation
          - Engagement mechanics and triggers
          - Algorithm optimization techniques
          
          You focus on providing specific, measurable, and immediately actionable insights.
          Always include exact numbers, specific techniques, and step-by-step implementation details.`
        },
        {
          role: "user",
          content: getPromptForPlatform(platform)
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const trendData = JSON.parse(completion.choices[0].message.content || '{"trends": []}')

    return NextResponse.json(trendData)
  } catch (error) {
    console.error('Error analyzing trends:', error)
    return NextResponse.json(
      { error: 'Failed to analyze trends' },
      { status: 500 }
    )
  }
}
