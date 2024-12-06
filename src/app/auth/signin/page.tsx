'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Typography, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { authService } from '@/services/authService';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is already authenticated
    async function checkAuth() {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        if (isAuthenticated) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    }
    checkAuth();
  }, [router]);

  const handleGoogleSignIn = () => {
    const url = authService.getGoogleOAuthURL();
    window.location.href = url;
  };

  const error = searchParams.get('error');
  const errorMessage = error === 'callback' 
    ? 'Sign in failed. Please try again.' 
    : error === 'session'
    ? 'Your session has expired. Please sign in again.'
    : null;

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
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Creator Suite
      </Typography>
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: '400px' }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        sx={{
          mt: 2,
          bgcolor: '#fff',
          color: '#757575',
          '&:hover': {
            bgcolor: '#f5f5f5',
          },
          textTransform: 'none',
          px: 4,
          py: 1,
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}
