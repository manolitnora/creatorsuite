'use client'

import { Typography, Grid, Paper } from '@mui/material'
import ContentPerformance from '@/components/Dashboard/ContentPerformance'
import AudienceInsights from '@/components/Dashboard/AudienceInsights'

export default function AnalyticsPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content Performance
            </Typography>
            <ContentPerformance showFullReport={true} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Audience Insights
            </Typography>
            <AudienceInsights showFullReport={true} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Engagement Metrics
            </Typography>
            {/* Add EngagementMetrics component */}
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
