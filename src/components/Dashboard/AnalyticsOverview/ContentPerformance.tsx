'use client'

import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import { MoreVert, TrendingUp } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { TimeRange } from '@/types/analytics'
import { analyticsService } from '@/services/analytics'

interface ContentItem {
  id: string
  content: string
  platform: string
  performance: number
  engagement: number
  trend: number
}

interface ContentPerformanceProps {
  timeRange: TimeRange
}

export default function ContentPerformance({ timeRange }: ContentPerformanceProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [topContent, setTopContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopContent = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await analyticsService.getTopContent(timeRange)
        setTopContent(data)
      } catch (err) {
        setError('Failed to load content performance data')
        console.error('Error fetching top content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopContent()
  }, [timeRange])

  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedContent(id)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedContent(null)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title="Top Performing Content" />
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Top Performing Content" />
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Top Performing Content" />
      <CardContent>
        <List>
          {topContent.map((item) => (
            <ListItem
              key={item.id}
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => handleClick(e, item.id)}
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <Box sx={{ width: '100%' }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box flexGrow={1}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      {item.content}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={item.platform}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Box display="flex" alignItems="center">
                        <TrendingUp
                          fontSize="small"
                          color={item.trend >= 0 ? 'success' : 'error'}
                          sx={{ mr: 0.5 }}
                        />
                        <Typography
                          variant="body2"
                          color={item.trend >= 0 ? 'success.main' : 'error.main'}
                        >
                          {item.trend}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Performance Score
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.performance}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {item.engagement.toLocaleString()} engagements
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>View Details</MenuItem>
        <MenuItem onClick={handleClose}>Share</MenuItem>
        <MenuItem onClick={handleClose}>Export Analytics</MenuItem>
      </Menu>
    </Card>
  )
}
