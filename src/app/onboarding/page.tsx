'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material'

const steps = [
  'Set Your Goals',
  'Connect Your Platforms',
  'Content Preferences',
  'Audience Insights'
]

const goalOptions = [
  { value: 'grow_audience', label: 'Grow My Audience', description: 'Get more followers and expand your reach' },
  { value: 'increase_engagement', label: 'Increase Engagement', description: 'Get more likes, comments, and shares' },
  { value: 'drive_traffic', label: 'Drive Traffic', description: 'Send more visitors to your website or landing page' },
  { value: 'generate_leads', label: 'Generate Leads', description: 'Convert followers into potential customers' },
  { value: 'build_community', label: 'Build Community', description: 'Create an engaged community around your content' }
]

const platforms = [
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'youtube', label: 'YouTube', icon: '🎥' }
]

const contentTypes = [
  { value: 'educational', label: 'Educational Content' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'product_updates', label: 'Product Updates' },
  { value: 'behind_scenes', label: 'Behind the Scenes' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, refreshUser } = useUser()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    goals: [],
    platforms: [],
    contentTypes: [],
    postingFrequency: '',
    targetAudience: '',
    industryFocus: '',
  })

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          onboardingCompleted: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      // Refresh user data to get updated preferences
      await refreshUser()
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit()
    } else {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleGoalSelect = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const handlePlatformSelect = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const handleContentTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }))
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              What are your main goals?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the goals that matter most to you. We'll customize your experience based on these goals.
            </Typography>
            <Grid container spacing={2}>
              {goalOptions.map((goal) => (
                <Grid item xs={12} sm={6} key={goal.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      bgcolor: formData.goals.includes(goal.value) ? 'primary.light' : 'background.paper',
                    }}
                    onClick={() => handleGoalSelect(goal.value)}
                  >
                    <CardContent>
                      <Typography variant="h6">{goal.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {goal.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Connect Your Social Media Platforms
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the platforms you want to manage. We'll help you optimize your content for each platform.
            </Typography>
            <Grid container spacing={2}>
              {platforms.map((platform) => (
                <Grid item xs={6} sm={4} key={platform.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      bgcolor: formData.platforms.includes(platform.value)
                        ? 'primary.light'
                        : 'background.paper',
                    }}
                    onClick={() => handlePlatformSelect(platform.value)}
                  >
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        {platform.icon}
                      </Typography>
                      <Typography variant="body1">{platform.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Content Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              What type of content do you want to create? This helps us tailor our suggestions.
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Content Types
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {contentTypes.map((type) => (
                    <Chip
                      key={type.value}
                      label={type.label}
                      onClick={() => handleContentTypeSelect(type.value)}
                      color={formData.contentTypes.includes(type.value) ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Posting Frequency</InputLabel>
                <Select
                  value={formData.postingFrequency}
                  label="Posting Frequency"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, postingFrequency: e.target.value }))
                  }
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">2-3 times per week</MenuItem>
                  <MenuItem value="biweekly">Once every two weeks</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        )

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Audience Insights
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tell us about your target audience to help create more engaging content.
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Target Audience"
                placeholder="e.g., Tech professionals, Small business owners"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))
                }
              />
              <TextField
                fullWidth
                label="Industry Focus"
                placeholder="e.g., Technology, Healthcare, Education"
                value={formData.industryFocus}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, industryFocus: e.target.value }))
                }
              />
            </Stack>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Complete'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
