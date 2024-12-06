import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface UserPreferences {
  goals: string[]
  platforms: string[]
  contentTypes: string[]
  postingFrequency: string
  targetAudience: string
  industryFocus: string
  onboardingCompleted: boolean
}

export function useUserPreferences() {
  const queryClient = useQueryClient()

  const { data: preferences, isLoading } = useQuery<UserPreferences>({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const response = await fetch('/api/user/preferences')
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences')
      }
      return response.json()
    },
  })

  const { mutate: updatePreferences } = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      })
      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] })
    },
  })

  const getRecommendedFeatures = () => {
    if (!preferences?.goals) return []

    const featureRecommendations = {
      grow_audience: [
        'audience-insights',
        'trending-topics',
        'hashtag-suggestions',
        'follower-analytics',
      ],
      increase_engagement: [
        'engagement-metrics',
        'optimal-times',
        'content-analyzer',
        'performance-tracking',
      ],
      drive_traffic: [
        'link-tracking',
        'click-analytics',
        'conversion-metrics',
        'traffic-sources',
      ],
      generate_leads: [
        'lead-capture',
        'conversion-tracking',
        'audience-segmentation',
        'campaign-analytics',
      ],
      build_community: [
        'community-metrics',
        'engagement-tools',
        'response-analytics',
        'sentiment-analysis',
      ],
    }

    return preferences.goals.flatMap(
      (goal) => featureRecommendations[goal as keyof typeof featureRecommendations] || []
    )
  }

  const getPlatformMetrics = () => {
    return preferences?.platforms.map((platform) => ({
      platform,
      metrics: ['followers', 'engagement', 'reach', 'impressions'],
    })) || []
  }

  const getContentSuggestions = () => {
    const suggestions: Record<string, string[]> = {
      educational: [
        'How-to guides',
        'Tips and tricks',
        'Industry insights',
        'Tutorial videos',
      ],
      entertainment: [
        'Behind the scenes',
        'Fun facts',
        'Challenges',
        'Trending topics',
      ],
      inspiration: [
        'Success stories',
        'Motivational quotes',
        'Achievement highlights',
        'Community spotlights',
      ],
      product_updates: [
        'Feature announcements',
        'Product demos',
        'Use cases',
        'Customer testimonials',
      ],
    }

    return preferences?.contentTypes.flatMap(
      (type) => suggestions[type] || []
    ) || []
  }

  return {
    preferences,
    isLoading,
    updatePreferences,
    getRecommendedFeatures,
    getPlatformMetrics,
    getContentSuggestions,
  }
}
