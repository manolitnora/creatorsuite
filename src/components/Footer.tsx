'use client';

import { Box, Container, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Creator Suite. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <Link
              component={NextLink}
              href="/terms"
              color="text.secondary"
              underline="hover"
            >
              Terms of Service
            </Link>
            <Link
              component={NextLink}
              href="/privacy"
              color="text.secondary"
              underline="hover"
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
