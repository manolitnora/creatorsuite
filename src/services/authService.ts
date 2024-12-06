import { jwtDecode } from 'jwt-decode';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

interface GoogleTokens {
  access_token: string;
  id_token: string;
  refresh_token?: string;
}

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

interface SessionData {
  tokens: GoogleTokens;
  user: GoogleUser;
}

export const authService = {
  // Generate OAuth URL for Google sign-in
  getGoogleOAuthURL: () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: GOOGLE_REDIRECT_URI,
      client_id: GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  },

  // Exchange authorization code for tokens and user info
  getGoogleTokens: async (code: string): Promise<SessionData> => {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get tokens');
    }

    return response.json();
  },

  // Save session with tokens and user info
  saveSession: async (data: SessionData): Promise<void> => {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save session');
    }
  },

  // Check if user is authenticated and get user data
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
};
