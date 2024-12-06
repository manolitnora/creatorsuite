'use client'

import { Typography, Grid, Paper } from '@mui/material'
import PostsList from '@/components/Dashboard/PostsList'

export default function SocialMediaManagerPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Social Media Manager
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <PostsList showFilters={true} />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
