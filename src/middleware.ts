import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require authentication
const publicPaths = [
  '/auth/signin',
  '/auth/callback',
  '/api/auth/google',
  '/api/auth/session',
  '/terms',
  '/privacy',
  '/_next',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('auth_session');
  if (!authCookie) {
    return redirectToSignIn(request);
  }

  try {
    // Verify session with Google
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
      },
    });

    if (!response.ok) {
      return redirectToSignIn(request);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return redirectToSignIn(request);
  }
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api).*)',
  ],
};
