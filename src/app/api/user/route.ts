import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import prisma from '@/services/db';

export async function GET(request: NextRequest) {
  try {
    const session = cookies().get('session');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Decode the session token to get the user's email
    const decoded = jwtDecode<{ email: string }>(session.value);
    
    // Fetch user with preferences
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data directly without wrapping it in an object
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
