import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material'
import {
  TrendingUp,
  People,
  Share,
  ThumbUp,
} from '@mui/icons-material'
import { TimeRange } from '@/types/analytics'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  progress?: number
}

function MetricCard({ title, value, change, icon, progress }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: 'primary.light',
              color: 'primary.main',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" component="div" gutterBottom>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="body2"
            color={change >= 0 ? 'success.main' : 'error.main'}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <TrendingUp
              sx={{
                fontSize: 16,
                mr: 0.5,
                transform: change < 0 ? 'rotate(180deg)' : 'none',
              }}
            />
            {Math.abs(change)}% from previous period
          </Typography>
        </Box>

        {progress !== undefined && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

interface PerformanceMetricsProps {
  timeRange: TimeRange
}

export default function PerformanceMetrics({ timeRange }: PerformanceMetricsProps) {
  // Mock data - replace with API call
  const metrics = {
    engagement: {
      value: '24.8K',
      change: 12.5,
      progress: 78,
    },
    audience: {
      value: '15.2K',
      change: 8.3,
      progress: 65,
    },
    shares: {
      value: '3.4K',
      change: -2.1,
      progress: 45,
    },
    likes: {
      value: '98.2K',
      change: 15.7,
      progress: 85,
    },
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Engagement Rate"
          value={metrics.engagement.value}
          change={metrics.engagement.change}
          icon={<TrendingUp />}
          progress={metrics.engagement.progress}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Audience Growth"
          value={metrics.audience.value}
          change={metrics.audience.change}
          icon={<People />}
          progress={metrics.audience.progress}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Shares"
          value={metrics.shares.value}
          change={metrics.shares.change}
          icon={<Share />}
          progress={metrics.shares.progress}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Likes"
          value={metrics.likes.value}
          change={metrics.likes.change}
          icon={<ThumbUp />}
          progress={metrics.likes.progress}
        />
      </Grid>
    </Grid>
  )
}
