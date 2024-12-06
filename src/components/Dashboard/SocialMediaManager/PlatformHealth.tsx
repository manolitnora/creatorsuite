'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Settings,
} from '@mui/icons-material'
import { Platform } from '@/types/content'
import { socialService, PlatformStatus } from '@/services/social'
import { formatDistanceToNow } from 'date-fns'

export default function PlatformHealth() {
  const [platforms, setPlatforms] = useState<PlatformStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPlatformStatus = async () => {
    try {
      setError(null)
      if (!refreshing) setLoading(true)
      const data = await socialService.getPlatformStatus()
      setPlatforms(data)
    } catch (err) {
      setError('Failed to load platform status')
      console.error('Error fetching platform status:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPlatformStatus()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchPlatformStatus()
  }

  const handleVerifyConnection = async (platform: Platform) => {
    try {
      setError(null)
      const result = await socialService.verifyPlatformConnection(platform)
      if (result.success) {
        // Refresh platform status after successful verification
        fetchPlatformStatus()
      } else {
        setError(result.message || 'Failed to verify platform connection')
      }
    } catch (err) {
      console.error('Error verifying platform connection:', err)
      setError('Failed to verify platform connection')
    }
  }

  const getStatusIcon = (status: PlatformStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle color="success" />
      case 'warning':
        return <Warning color="warning" />
      case 'error':
        return <Error color="error" />
    }
  }

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Platform Status
        </Typography>
        <Tooltip title="Refresh status">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {refreshing && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Grid container spacing={2}>
        {platforms.map((platform) => (
          <Grid item xs={12} sm={6} md={4} key={platform.platform}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {getStatusIcon(platform.status)}
                      <Typography variant="h6">{platform.platform}</Typography>
                    </Stack>
                    <Tooltip title="Platform settings">
                      <IconButton size="small">
                        <Settings />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="body2" color="text.secondary">
                        API Quota Usage
                      </Typography>
                      <Typography variant="body2">
                        {platform.apiQuota.used} / {platform.apiQuota.total}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(platform.apiQuota.used / platform.apiQuota.total) * 100}
                      color={
                        platform.apiQuota.used / platform.apiQuota.total > 0.9
                          ? 'error'
                          : platform.apiQuota.used / platform.apiQuota.total > 0.7
                          ? 'warning'
                          : 'primary'
                      }
                    />
                  </Box>

                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Last Synced: {formatDistanceToNow(new Date(platform.lastSync))} ago
                    </Typography>
                    {platform.message && (
                      <Typography
                        variant="body2"
                        color={platform.status === 'error' ? 'error' : 'text.secondary'}
                      >
                        {platform.message}
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleVerifyConnection(platform.platform)}
                    >
                      Verify Connection
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
