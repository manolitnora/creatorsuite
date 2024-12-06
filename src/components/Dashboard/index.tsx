import { Grid } from '@mui/material'
import ContentGenerator from './ContentGenerator'
import SocialMediaManager from './SocialMediaManager'
import AnalyticsOverview from './AnalyticsOverview'

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ContentGenerator />
      </Grid>
      <Grid item xs={12} md={6}>
        <SocialMediaManager />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsOverview />
      </Grid>
    </Grid>
  )
}
