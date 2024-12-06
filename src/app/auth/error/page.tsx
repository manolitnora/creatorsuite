'use client'

import { useSearchParams } from 'next/navigation'
import { Box, Button, Container, Paper, Typography, Error as ErrorIcon } from '@mui/material'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      case 'Verification':
        return 'The verification link was invalid or has expired.'
      case 'OAuthSignin':
        return 'Error in the OAuth sign-in process. Please try again.'
      case 'OAuthCallback':
        return 'Error receiving the OAuth response. Please try again.'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth provider user in the database.'
      case 'EmailCreateAccount':
        return 'Could not create email provider user in the database.'
      case 'Callback':
        return 'Error during the OAuth callback. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'Email already exists with a different provider.'
      case 'EmailSignin':
        return 'Check your email inbox for the sign-in link.'
      case 'CredentialsSignin':
        return 'Sign in failed. Check your credentials and try again.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Authentication Error
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            {getErrorMessage(error)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => signIn(undefined, { callbackUrl: '/' })}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
            >
              Go to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
