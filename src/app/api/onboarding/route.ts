import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const {
      goals,
      platforms,
      contentTypes,
      postingFrequency,
      targetAudience,
      industryFocus,
    } = data

    // Save or update user preferences
    const userPreferences = await prisma.userPreferences.upsert({
      where: {
        userEmail: session.user.email,
      },
      update: {
        goals,
        platforms,
        contentTypes,
        postingFrequency,
        targetAudience,
        industryFocus,
        onboardingCompleted: true,
      },
      create: {
        userEmail: session.user.email,
        goals,
        platforms,
        contentTypes,
        postingFrequency,
        targetAudience,
        industryFocus,
        onboardingCompleted: true,
      },
    })

    return NextResponse.json({ success: true, data: userPreferences })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
