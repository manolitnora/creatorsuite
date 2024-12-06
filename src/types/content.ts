export type Platform = 'Twitter' | 'Instagram' | 'LinkedIn' | 'Facebook' | 'TikTok'

export interface ContentRequest {
  baseContent: string
  platforms: Platform[]
  enableAbTesting: boolean
  abTestMinSampleSize?: number
  abTestDurationHours?: number
}

export interface ContentResponse {
  content: string
  platform: Platform
  predictedPerformance: number
  metadata: Record<string, any>
  testId?: string
}

export interface ABTestResults {
  testId: string
  name: string
  description: string
  platform: Platform
  startTime: string
  endTime: string
  status: 'running' | 'completed' | 'failed'
  variants: Array<{
    id: string
    content: string
    isControl: boolean
    metrics: {
      impressions: number
      engagements: number
      clicks: number
      conversions: number
    }
  }>
  winner?: {
    variantId: string
    improvement: number
    confidence: number
  }
}
