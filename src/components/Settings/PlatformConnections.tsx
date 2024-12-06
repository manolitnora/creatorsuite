'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Switch,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import {
  Twitter,
  LinkedIn,
  Instagram,
  YouTube,
  Settings,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material'
import { Platform } from '@/types/content'
import { socialService } from '@/services/social'

interface PlatformConfig {
  platform: Platform
  connected: boolean
  icon: React.ElementType
  status?: 'healthy' | 'warning' | 'error'
  lastSync?: string
  apiKey?: string
  apiSecret?: string
}

export default function PlatformConnections() {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([
    { platform: 'Twitter', connected: false, icon: Twitter },
    { platform: 'LinkedIn', connected: false, icon: LinkedIn },
    { platform: 'Instagram', connected: false, icon: Instagram },
    { platform: 'YouTube', connected: false, icon: YouTube },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [configOpen, setConfigOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null)
  const [configForm, setConfigForm] = useState({
    apiKey: '',
    apiSecret: '',
  })

  useEffect(() => {
    fetchPlatformStatus()
  }, [])

  const fetchPlatformStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const statuses = await socialService.getPlatformStatus()
      
      setPlatforms(prev => prev.map(platform => {
        const status = statuses.find(s => s.platform === platform.platform)
        return {
          ...platform,
          connected: !!status,
          status: status?.status,
          lastSync: status?.lastSync,
        }
      }))
    } catch (err) {
      setError('Failed to fetch platform status')
      console.error('Error fetching platform status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfigOpen = (platform: PlatformConfig) => {
    setSelectedPlatform(platform)
    setConfigForm({
      apiKey: platform.apiKey || '',
      apiSecret: platform.apiSecret || '',
    })
    setConfigOpen(true)
  }

  const handleConfigClose = () => {
    setConfigOpen(false)
    setSelectedPlatform(null)
    setConfigForm({ apiKey: '', apiSecret: '' })
  }

  const handleConfigSave = async () => {
    if (!selectedPlatform) return

    try {
      setLoading(true)
      // TODO: Implement saving platform configuration
      // const response = await fetch('/api/platforms/config', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     platform: selectedPlatform.platform,
      //     ...configForm,
      //   }),
      // })

      // Verify connection
      const result = await socialService.verifyPlatformConnection(selectedPlatform.platform)
      if (result.success) {
        await fetchPlatformStatus()
        handleConfigClose()
      } else {
        setError(result.message || 'Failed to verify platform connection')
      }
    } catch (err) {
      setError('Failed to save platform configuration')
      console.error('Error saving platform config:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (platform: PlatformConfig) => {
    if (!platform.connected) return null
    if (platform.status === 'healthy') return <CheckCircle color="success" />
    if (platform.status === 'error') return <ErrorIcon color="error" />
    return null
  }

  if (loading && platforms.every(p => !p.connected)) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {platforms.map((platform) => (
          <Grid item xs={12} md={6} key={platform.platform}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <platform.icon fontSize="large" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {platform.platform}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {platform.connected
                        ? `Last synced: ${new Date(platform.lastSync || '').toLocaleString()}`
                        : 'Not connected'}
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {getStatusIcon(platform)}
                    <Switch
                      checked={platform.connected}
                      onChange={() => {
                        if (!platform.connected) {
                          handleConfigOpen(platform)
                        }
                        // TODO: Handle disconnection
                      }}
                    />
                    {platform.connected && (
                      <IconButton
                        size="small"
                        onClick={() => handleConfigOpen(platform)}
                      >
                        <Settings />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={configOpen} onClose={handleConfigClose}>
        <DialogTitle>
          Configure {selectedPlatform?.platform}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="API Key"
              value={configForm.apiKey}
              onChange={(e) => setConfigForm(prev => ({ ...prev, apiKey: e.target.value }))}
            />
            <TextField
              fullWidth
              label="API Secret"
              type="password"
              value={configForm.apiSecret}
              onChange={(e) => setConfigForm(prev => ({ ...prev, apiSecret: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfigClose}>Cancel</Button>
          <Button
            onClick={handleConfigSave}
            variant="contained"
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
