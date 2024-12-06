'use client';

import { Box, Container, Typography, Paper } from '@mui/material';

export default function PrivacyPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="body1" paragraph>
            At Creator Suite, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            When you use Creator Suite, we collect several types of information:
            - Account information (name, email, profile picture) when you sign in with Google
            - Usage data about how you interact with our service
            - Content and analytics data you choose to manage through our platform
            - Technical data such as your IP address, browser type, and device information
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
            - Provide, maintain, and improve our services
            - Process your requests and transactions
            - Send you technical notices and support messages
            - Communicate with you about products, services, and updates
            - Monitor and analyze trends and usage
            - Prevent fraud and enhance security
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            3. Information Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell your personal information. We may share your information only in the following circumstances:
            - With your consent
            - To comply with legal obligations
            - To protect our rights and prevent fraud
            - With service providers who assist in our operations
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            4. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational security measures to protect your personal information. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
            - Access your personal information
            - Correct inaccurate information
            - Request deletion of your information
            - Object to our processing of your information
            - Export your data in a portable format
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            6. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            Our service integrates with various third-party services (such as Google, Twitter, etc.). Your interactions with these services are governed by their respective privacy policies.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            7. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes.
          </Typography>

          <Typography variant="body1" sx={{ mt: 4 }}>
            If you have any questions about this Privacy Policy, please contact us.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
