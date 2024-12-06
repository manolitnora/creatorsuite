'use client';

import { Box, Container, Typography, Paper } from '@mui/material';

export default function TermsPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Terms of Service
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Creator Suite, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            2. Use License
          </Typography>
          <Typography variant="body1" paragraph>
            Permission is granted to temporarily access Creator Suite for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            - modify or copy the materials
            - use the materials for any commercial purpose
            - attempt to decompile or reverse engineer any software contained in Creator Suite
            - remove any copyright or other proprietary notations from the materials
            - transfer the materials to another person or "mirror" the materials on any other server
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            3. Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            The materials on Creator Suite are provided on an 'as is' basis. Creator Suite makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            4. Limitations
          </Typography>
          <Typography variant="body1" paragraph>
            In no event shall Creator Suite or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Creator Suite, even if Creator Suite or a Creator Suite authorized representative has been notified orally or in writing of the possibility of such damage.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            5. Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Your use of Creator Suite is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            6. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            7. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            Creator Suite reserves the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </Typography>

          <Typography variant="body1" sx={{ mt: 4 }}>
            If you have any questions about these Terms, please contact us.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
