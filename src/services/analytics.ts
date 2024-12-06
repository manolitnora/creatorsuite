import api from './api'
import {
  TimeRange,
  AnalyticsMetrics,
  EngagementData,
  AudienceDemographics,
} from '@/types/analytics'
import { Platform } from '@/types/content'

export const analyticsService = {
  getMetrics: async (
    timeRange: TimeRange,
    platforms?: Platform[]
  ): Promise<AnalyticsMetrics> => {
    const response = await api.get('/analytics/metrics', {
      params: { timeRange, platforms },
    })
    return response.data
  },

  getEngagementData: async (
    timeRange: TimeRange,
    platforms?: Platform[]
  ): Promise<EngagementData[]> => {
    const response = await api.get('/analytics/engagement', {
      params: { timeRange, platforms },
    })
    return response.data
  },

  getTopContent: async (
    timeRange: TimeRange,
    limit: number = 5
  ): Promise<any[]> => {
    const response = await api.get('/analytics/top-content', {
      params: { timeRange, limit },
    })
    return response.data
  },

  getAudienceInsights: async (
    timeRange: TimeRange
  ): Promise<AudienceDemographics> => {
    const response = await api.get('/analytics/audience', {
      params: { timeRange },
    })
    return response.data
  },

  exportData: async (
    timeRange: TimeRange,
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob> => {
    const response = await api.get('/analytics/export', {
      params: { timeRange, format },
      responseType: 'blob',
    })
    return response.data
  },
}
