'use client'

import { Typography, Grid, Paper } from '@mui/material'

export default function SchedulePage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Content Schedule
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {/* Add Calendar component */}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Posts
            </Typography>
            {/* Add ScheduledPosts component */}
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
