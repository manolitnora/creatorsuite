'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import ContentPerformance from '@/components/Dashboard/AnalyticsOverview/ContentPerformance';
import EngagementChart from '@/components/Dashboard/AnalyticsOverview/EngagementChart';
import OptimalTimesHeatmap from '@/components/schedule/OptimalTimesHeatmap';
import AudienceInsights from '@/components/Dashboard/AnalyticsOverview/AudienceInsights';
import TrendMetricsCard from '@/components/Dashboard/TrendMetricsCard';
import PostsList from '@/components/Dashboard/SocialMediaManager/PostsList';
import PlatformHealth from '@/components/Dashboard/SocialMediaManager/PlatformHealth';
import ContentAnalyzer from '@/components/content/ContentAnalyzer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

export default function DashboardPage() {
  const { user, loading: userLoading, error: userError } = useUser();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const { 
    preferences, 
    isLoading: prefsLoading,
    getRecommendedFeatures, 
    getPlatformMetrics, 
    getContentSuggestions 
  } = useUserPreferences();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/signin');
    } else if (user && preferences && !preferences.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, userLoading, preferences, router]);

  if (userLoading || prefsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userError) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">{userError}</Alert>
      </Container>
    );
  }

  if (!user || !preferences) {
    return null;
  }

  const platformMetrics = getPlatformMetrics();
  const contentSuggestions = getContentSuggestions();

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user.name}!
        </Typography>
        
        {/* Display user preferences */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Your Content Strategy
          </Typography>
          <Typography variant="body1" paragraph>
            Goals: {preferences.goals.join(', ')}
          </Typography>
          <Typography variant="body1" paragraph>
            Platforms: {preferences.platforms.join(', ')}
          </Typography>
          <Typography variant="body1" paragraph>
            Content Types: {preferences.contentTypes.join(', ')}
          </Typography>
          {preferences.postingFrequency && (
            <Typography variant="body1" paragraph>
              Posting Frequency: {preferences.postingFrequency}
            </Typography>
          )}
          {preferences.targetAudience && (
            <Typography variant="body1" paragraph>
              Target Audience: {preferences.targetAudience}
            </Typography>
          )}
          {preferences.industryFocus && (
            <Typography variant="body1" paragraph>
              Industry Focus: {preferences.industryFocus}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ py: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Dashboard Overview
            </Typography>
            
            {/* Platform Selector */}
            <Tabs
              value={selectedPlatform}
              onChange={(_, value) => setSelectedPlatform(value)}
              sx={{ mb: 2 }}
            >
              {preferences.platforms.map((platform) => (
                <Tab key={platform} label={platform} value={platform} />
              ))}
            </Tabs>

            {/* Goals */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Your Goals
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {preferences.goals.map((goal) => (
                  <Chip key={goal} label={goal.replace('_', ' ')} />
                ))}
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Platform-specific Metrics */}
            {platformMetrics.map((platform) => (
              platform.metrics.map((metric, index) => (
                <Grid item xs={12} md={3} key={`${platform.platform}-${metric}`}>
                  <TrendMetricsCard
                    title={`${platform.platform} ${metric}`}
                    value={Math.floor(Math.random() * 10000)}
                    change={Math.floor(Math.random() * 20) - 10}
                    unit={metric === 'engagement' ? '%' : ''}
                  />
                </Grid>
              ))
            ))}

            {/* Goal-specific Components */}
            {preferences.goals.includes('grow_audience') && (
              <Grid item xs={12} lg={8}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Audience Growth Insights
                  </Typography>
                  <AudienceInsights />
                </Paper>
              </Grid>
            )}

            {preferences.goals.includes('increase_engagement') && (
              <>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2 }}>
                    <EngagementChart
                      data={[]} // TODO: Add engagement data
                      title="Engagement Trends"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <OptimalTimesHeatmap data={[]} /> {/* TODO: Add optimal times data */}
                  </Paper>
                </Grid>
              </>
            )}

            {preferences.goals.includes('drive_traffic') && (
              <Grid item xs={12} lg={8}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Traffic Analytics
                  </Typography>
                  <ContentPerformance />
                </Paper>
              </Grid>
            )}

            {/* Content Suggestions */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Content Ideas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {contentSuggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      onClick={() => {/* TODO: Open content creator with template */}}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Recent Posts */}
            <Grid item xs={12} md={6} lg={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Posts
                </Typography>
                <PostsList />
              </Paper>
            </Grid>

            {/* Platform Health */}
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Platform Health
                </Typography>
                <PlatformHealth />
              </Paper>
            </Grid>

            {/* Content Analyzer */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <ContentAnalyzer onAnalyze={() => {}} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
