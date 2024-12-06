import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import prisma from '@/services/db';

export async function GET() {
  try {
    const session = cookies().get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwtDecode<{ email: string }>(session.value);
    const preferences = await prisma.userPreferences.findUnique({
      where: { userEmail: decoded.email },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = cookies().get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwtDecode<{ email: string }>(session.value);
    const data = await request.json();

    // Validate required fields
    if (!data.goals || !data.platforms || !data.contentTypes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const preferences = await prisma.userPreferences.upsert({
      where: { userEmail: decoded.email },
      update: {
        goals: data.goals,
        platforms: data.platforms,
        contentTypes: data.contentTypes,
        postingFrequency: data.postingFrequency,
        targetAudience: data.targetAudience,
        industryFocus: data.industryFocus,
        onboardingCompleted: data.onboardingCompleted ?? false,
      },
      create: {
        userEmail: decoded.email,
        goals: data.goals,
        platforms: data.platforms,
        contentTypes: data.contentTypes,
        postingFrequency: data.postingFrequency,
        targetAudience: data.targetAudience,
        industryFocus: data.industryFocus,
        onboardingCompleted: data.onboardingCompleted ?? false,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
