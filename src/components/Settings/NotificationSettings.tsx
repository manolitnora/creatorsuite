'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Stack,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'

interface NotificationSetting {
  id: string
  category: string
  title: string
  description: string
  email: boolean
  push: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      category: 'Content',
      title: 'Content Performance',
      description: 'Get notified when your content reaches performance milestones',
      email: true,
      push: true,
      frequency: 'immediate',
    },
    {
      id: '2',
      category: 'Content',
      title: 'Scheduled Posts',
      description: 'Notifications about your scheduled content being published',
      email: true,
      push: true,
      frequency: 'immediate',
    },
    {
      id: '3',
      category: 'Analytics',
      title: 'Weekly Reports',
      description: 'Receive weekly performance and analytics reports',
      email: true,
      push: false,
      frequency: 'weekly',
    },
    {
      id: '4',
      category: 'Team',
      title: 'Team Activity',
      description: 'Stay updated on team member actions and comments',
      email: false,
      push: true,
      frequency: 'daily',
    },
    {
      id: '5',
      category: 'System',
      title: 'Platform Updates',
      description: 'Important updates about CreatorSuite features and maintenance',
      email: true,
      push: true,
      frequency: 'immediate',
    },
  ])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleToggle = (id: string, type: 'email' | 'push') => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, [type]: !setting[type] }
          : setting
      )
    )
  }

  const handleFrequencyChange = (id: string, frequency: NotificationSetting['frequency']) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, frequency }
          : setting
      )
    )
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // TODO: Implement saving notification settings to backend
      // await fetch('/api/settings/notifications', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ settings }),
      // })
      
      setMessage({ type: 'success', text: 'Notification settings saved successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save notification settings' })
    } finally {
      setLoading(false)
    }
  }

  const categories = Array.from(new Set(settings.map(s => s.category)))

  return (
    <Box>
      <Stack spacing={3}>
        {categories.map((category) => (
          <Card key={category}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {category} Notifications
              </Typography>
              <FormGroup>
                {settings
                  .filter(setting => setting.category === category)
                  .map((setting) => (
                    <Box key={setting.id}>
                      <Box sx={{ py: 2 }}>
                        <Typography variant="subtitle1">
                          {setting.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {setting.description}
                        </Typography>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                          alignItems={{ xs: 'stretch', sm: 'center' }}
                          sx={{ mt: 1 }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={setting.email}
                                onChange={() => handleToggle(setting.id, 'email')}
                              />
                            }
                            label="Email"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={setting.push}
                                onChange={() => handleToggle(setting.id, 'push')}
                              />
                            }
                            label="Push Notifications"
                          />
                          <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Frequency</InputLabel>
                            <Select
                              value={setting.frequency}
                              label="Frequency"
                              onChange={(e) => handleFrequencyChange(setting.id, e.target.value as NotificationSetting['frequency'])}
                            >
                              <MenuItem value="immediate">Immediate</MenuItem>
                              <MenuItem value="daily">Daily Digest</MenuItem>
                              <MenuItem value="weekly">Weekly Summary</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
              </FormGroup>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Stack>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {message && (
          <Alert
            onClose={() => setMessage(null)}
            severity={message.type}
            sx={{ width: '100%' }}
          >
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </Box>
  )
}
