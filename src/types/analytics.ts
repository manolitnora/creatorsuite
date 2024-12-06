export type TimeRange = '7d' | '30d' | '90d'

export interface AnalyticsMetrics {
  engagement: {
    value: number
    change: number
    progress: number
  }
  audience: {
    value: number
    change: number
    progress: number
  }
  shares: {
    value: number
    change: number
    progress: number
  }
  likes: {
    value: number
    change: number
    progress: number
  }
}

export interface EngagementData {
  date: string
  likes: number
  shares: number
  comments: number
}

export interface AudienceDemographics {
  age: Array<{
    range: string
    percentage: number
  }>
  location: Array<{
    country: string
    users: number
  }>
  interests: Array<{
    category: string
    percentage: number
  }>
}
