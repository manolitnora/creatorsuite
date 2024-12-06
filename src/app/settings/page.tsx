'use client'

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import SettingsNavigation from '@/components/Settings/SettingsNavigation'
import ProfileSettings from '@/components/Settings/ProfileSettings'
import PlatformConnections from '@/components/Settings/PlatformConnections'
import NotificationSettings from '@/components/Settings/NotificationSettings'
import TeamManagement from '@/components/Settings/TeamManagement'
import ApiConfiguration from '@/components/Settings/ApiConfiguration'
import { usePathname } from 'next/navigation'

export default function SettingsPage() {
  const pathname = usePathname()
  
  const renderContent = () => {
    switch (pathname) {
      case '/settings/profile':
        return <ProfileSettings />
      case '/settings/connections':
        return <PlatformConnections />
      case '/settings/notifications':
        return <NotificationSettings />
      case '/settings/team':
        return <TeamManagement />
      case '/settings/api':
        return <ApiConfiguration />
      default:
        return <ProfileSettings /> // Default to profile settings
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ mb: { xs: 2, md: 0 } }}>
            <SettingsNavigation />
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {renderContent()}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
