'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          throw new Error(`Google OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code provided');
        }

        // Exchange code for tokens and get user info
        const { tokens, user } = await authService.getGoogleTokens(code);
        
        // Save session with tokens and user info
        await authService.saveSession({ tokens, user });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        // Wait a bit before redirecting on error
        setTimeout(() => {
          router.push('/auth/signin?error=callback');
        }, 3000);
      }
    }

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography>Redirecting to sign in...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>Completing sign in...</Typography>
    </Box>
  );
}
