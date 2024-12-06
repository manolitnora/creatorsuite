import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { Download, Help } from '@mui/icons-material'
import PerformanceMetrics from './PerformanceMetrics'
import EngagementChart from './EngagementChart'
import ContentPerformance from './ContentPerformance'
import AudienceInsights from './AudienceInsights'
import { TimeRange } from '@/types/analytics'

export default function AnalyticsOverview() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')

  const handleTimeRangeChange = (
    _: React.MouseEvent<HTMLElement>,
    newTimeRange: TimeRange,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange)
    }
  }

  const handleExportData = () => {
    // TODO: Implement data export
  }

  return (
    <Card>
      <CardHeader
        title="Analytics Overview"
        action={
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
            >
              <ToggleButton value="7d">7D</ToggleButton>
              <ToggleButton value="30d">30D</ToggleButton>
              <ToggleButton value="90d">90D</ToggleButton>
            </ToggleButtonGroup>
            <Tooltip title="Export analytics data">
              <IconButton onClick={handleExportData}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Learn more about analytics">
              <IconButton>
                <Help />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12}>
            <PerformanceMetrics timeRange={timeRange} />
          </Grid>

          {/* Engagement Over Time */}
          <Grid item xs={12} md={8}>
            <EngagementChart timeRange={timeRange} />
          </Grid>

          {/* Content Performance */}
          <Grid item xs={12} md={4}>
            <ContentPerformance timeRange={timeRange} />
          </Grid>

          {/* Audience Insights */}
          <Grid item xs={12}>
            <AudienceInsights timeRange={timeRange} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
