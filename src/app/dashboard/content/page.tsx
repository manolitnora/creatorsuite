'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Chip,
  CardHeader,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material'
import {
  AutoAwesome as AutoAwesomeIcon,
  Save as SaveIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material'
import SaveContentModal from '@/components/Dashboard/ContentManager/SaveContentModal'

const platforms = [
  { 
    value: 'instagram',
    label: 'Instagram',
    icon: <InstagramIcon />,
    contentTypes: [
      { value: 'reel', label: 'Reel', description: 'Short-form vertical video content (15-60 seconds)' },
      { value: 'carousel', label: 'Carousel Post', description: 'Multiple images/slides with detailed information' },
      { value: 'single', label: 'Single Post', description: 'Single image with engaging caption' },
      { value: 'story', label: 'Story', description: 'Ephemeral 24-hour content with interactive elements' },
    ]
  },
  { 
    value: 'twitter',
    label: 'Twitter',
    icon: <TwitterIcon />,
    contentTypes: [
      { value: 'tweet', label: 'Tweet', description: 'Short text update (280 characters)' },
      { value: 'thread', label: 'Thread', description: 'Connected series of tweets' },
    ]
  },
  { 
    value: 'facebook',
    label: 'Facebook',
    icon: <FacebookIcon />,
    contentTypes: [
      { value: 'post', label: 'Post', description: 'Standard Facebook post' },
      { value: 'video', label: 'Video Post', description: 'Video content optimized for Facebook' },
      { value: 'story', label: 'Story', description: 'Ephemeral 24-hour content' },
    ]
  },
  { 
    value: 'linkedin',
    label: 'LinkedIn',
    icon: <LinkedInIcon />,
    contentTypes: [
      { value: 'post', label: 'Post', description: 'Professional update' },
      { value: 'article', label: 'Article', description: 'Long-form professional content' },
      { value: 'newsletter', label: 'Newsletter', description: 'Professional newsletter content' },
    ]
  },
]

interface TrendingTopic {
  title: string
  description: string
  engagementRate: string
  growthRate: string
  category: string
  suggestedFormat: string
}

interface CachedInsights {
  timestamp: number
  insights: Array<{
    title: string
    description: string
    engagementRate: string
    growthRate: string
    category: string
    suggestedFormat: string
  }>
}

export default function ContentGeneratorPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [contentType, setContentType] = useState('')
  const [contentTone, setContentTone] = useState('')
  const [topic, setTopic] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [trendingTopics, setTrendingTopics] = useState<Array<any>>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [trendError, setTrendError] = useState<string | null>(null)

  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  const getCachedInsights = (platform: string): CachedInsights | null => {
    const cached = localStorage.getItem(`insights_${platform}`)
    if (!cached) return null

    try {
      const parsedCache = JSON.parse(cached) as CachedInsights
      const now = Date.now()

      // Check if cache is expired
      if (now - parsedCache.timestamp > CACHE_DURATION) {
        localStorage.removeItem(`insights_${platform}`)
        return null
      }

      return parsedCache
    } catch (e) {
      localStorage.removeItem(`insights_${platform}`)
      return null
    }
  }

  const setCachedInsights = (platform: string, insights: any[]) => {
    const cacheData: CachedInsights = {
      timestamp: Date.now(),
      insights,
    }
    localStorage.setItem(`insights_${platform}`, JSON.stringify(cacheData))
  }

  const fetchTrendingTopics = async (platform: string) => {
    // First check cache
    const cached = getCachedInsights(platform)
    if (cached) {
      setTrendingTopics(cached.insights)
      return
    }

    setIsLoadingTrends(true)
    setTrendError(null)

    try {
      const apiKey = localStorage.getItem('openai_api_key')
      if (!apiKey) {
        throw new Error('Please add your OpenAI API key in Settings first')
      }

      const response = await fetch('/api/analyze-trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, apiKey }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in about an hour.')
        }
        throw new Error(errorData.message || 'Failed to fetch insights')
      }

      const data = await response.json()
      const insights = data.trends || []
      setTrendingTopics(insights)

      // Cache the new insights
      setCachedInsights(platform, insights)
    } catch (err: any) {
      setTrendError(err.message)
      setTrendingTopics([])
    } finally {
      setIsLoadingTrends(false)
    }
  }

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform)
    setContentType('') // Reset content type when platform changes
    if (platform) {
      fetchTrendingTopics(platform)
    }
  }

  const handleRefreshInsights = async () => {
    if (!selectedPlatform) return;
    
    // Clear cache for the platform
    localStorage.removeItem(`insights_${selectedPlatform}`);
    
    // Fetch fresh insights
    await fetchTrendingTopics(selectedPlatform);
  };

  useEffect(() => {
    // Check cache on initial load if platform is selected
    if (selectedPlatform) {
      const cached = getCachedInsights(selectedPlatform)
      if (cached) {
        setTrendingTopics(cached.insights)
      } else {
        fetchTrendingTopics(selectedPlatform)
      }
    }
  }, [selectedPlatform])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or select a trending topic')
      return
    }

    const apiKey = localStorage.getItem('openai_api_key')
    if (!apiKey) {
      setError('Please add your OpenAI API key in Settings first')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: selectedPlatform,
          tone: contentTone,
          topic,
          contentType,
          apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      setGeneratedContent(data.content)
    } catch (error) {
      console.error('Error generating content:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseError = () => {
    setError(null)
  }

  const handleCloseSuccess = () => {
    setSuccessMessage(null)
  }

  const handleSaveContent = async (data: any) => {
    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save content')
      }

      setSuccessMessage('Content saved successfully!')
      setSaveModalOpen(false)
    } catch (error) {
      setError('Failed to save content. Please try again.')
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    setSuccessMessage('Content copied to clipboard!')
  }

  const handleDeleteContent = () => {
    setGeneratedContent('')
    setSuccessMessage('Content deleted')
  }

  // Get the selected platform's content types
  const selectedPlatformData = platforms.find(p => p.value === selectedPlatform)
  const availableContentTypes = selectedPlatformData?.contentTypes || []

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Content Generator
      </Typography>

      <Grid container spacing={3}>
        {/* Platform Selection and Insights */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon />
                <Box>
                  <Typography variant="h6">Performance Patterns</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Current high-performing content techniques
                  </Typography>
                </Box>
              </Box>
              {selectedPlatform && (
                <Tooltip title="Refresh insights">
                  <IconButton 
                    onClick={handleRefreshInsights}
                    disabled={isLoadingTrends}
                    size="small"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <TextField
              select
              fullWidth
              label="Platform"
              value={selectedPlatform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              sx={{ mb: 3 }}
              required
            >
              {platforms.map((platform) => (
                <MenuItem key={platform.value} value={platform.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {platform.icon}
                    {platform.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {!selectedPlatform ? (
              <Typography color="text.secondary">
                Select a platform to view content performance patterns
              </Typography>
            ) : isLoadingTrends ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : trendError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {trendError.includes('rate limit') ? 
                  'API rate limit reached. Please try again in about an hour.' :
                  trendError
                }
              </Alert>
            ) : trendingTopics.length === 0 ? (
              <Typography color="text.secondary">
                No performance patterns available at the moment
              </Typography>
            ) : (
              <>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last analyzed: {new Date(getCachedInsights(selectedPlatform)?.timestamp || Date.now()).toLocaleDateString()}
                  </Typography>
                  <Tooltip title="Performance patterns are refreshed every 24 hours or manually">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  These patterns are derived from analyzing current high-performing content. Each pattern includes specific implementation steps and performance metrics.
                </Typography>

                <Stack spacing={2}>
                  {trendingTopics.map((trend, index) => (
                    <Accordion key={index} elevation={0}>
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            flexDirection: 'column'
                          }
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                            {trend.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            <Chip
                              size="small"
                              icon={<TrendingUpIcon />}
                              label={trend.growthRate}
                              color="primary"
                            />
                            <Chip 
                              size="small" 
                              label={trend.category}
                              color="secondary"
                            />
                            <Chip
                              size="small"
                              icon={<AnalyticsIcon />}
                              label={`Engagement: ${trend.engagementRate}`}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {/* Pattern Description */}
                          <Box>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Pattern Overview
                            </Typography>
                            <Typography variant="body2">
                              {trend.description}
                            </Typography>
                          </Box>

                          {/* Implementation Steps */}
                          <Box>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Implementation Guide
                            </Typography>
                            <Typography variant="body2" component="div">
                              {trend.suggestedFormat.split('\n').map((step, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                  {step.startsWith('-') ? (
                                    <>
                                      <Box component="span" sx={{ color: 'primary.main' }}>•</Box>
                                      <Typography variant="body2">{step.substring(1).trim()}</Typography>
                                    </>
                                  ) : (
                                    <Typography variant="body2">{step}</Typography>
                                  )}
                                </Box>
                              ))}
                            </Typography>
                          </Box>

                          {/* Quick Copy Sections */}
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Button
                              size="small"
                              startIcon={<ContentCopyIcon />}
                              onClick={() => {
                                navigator.clipboard.writeText(trend.suggestedFormat);
                                setSuccessMessage('Implementation steps copied!');
                              }}
                            >
                              Copy Implementation Steps
                            </Button>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </>
            )}
          </Paper>
        </Grid>

        {/* Content Generation Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Content Creation" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Platform"
                    value={selectedPlatform}
                    onChange={(e) => handlePlatformChange(e.target.value)}
                    sx={{ mb: 3 }}
                    required
                  >
                    {platforms.map((platform) => (
                      <MenuItem key={platform.value} value={platform.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {platform.icon}
                          {platform.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {selectedPlatform && (
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label={`${selectedPlatformData?.label} Content Type`}
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      sx={{ mb: 3 }}
                      required
                      helperText={
                        contentType && 
                        availableContentTypes.find(type => type.value === contentType)?.description
                      }
                    >
                      {availableContentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Tone"
                    value={contentTone}
                    onChange={(e) => setContentTone(e.target.value)}
                    sx={{ mb: 3 }}
                  >
                    <MenuItem value="professional">Professional</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="humorous">Humorous</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    sx={{ mb: 3 }}
                    required
                    multiline
                    rows={2}
                    placeholder="What would you like to create content about?"
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                disabled={isLoading || !topic || !contentType || !selectedPlatform}
                startIcon={isLoading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
              >
                {isLoading ? 'Generating...' : 'Generate Content'}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card sx={{ mt: 3 }}>
              <CardHeader title="Generated Content" />
              <CardContent>
                <Typography variant="body1" whiteSpace="pre-wrap">
                  {generatedContent}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  startIcon={<CopyIcon />} 
                  onClick={handleCopyToClipboard}
                  disabled={!generatedContent}
                >
                  Copy
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={() => setSaveModalOpen(true)}
                  disabled={!generatedContent}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  color="error"
                  onClick={handleDeleteContent}
                  disabled={!generatedContent}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          )}
        </Grid>
      </Grid>

      <SaveContentModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveContent}
        initialContent={generatedContent}
        contentType={selectedPlatform}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
