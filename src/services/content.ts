import api from './api'
import { ContentRequest, ContentResponse, ABTestResults } from '@/types/content'

export const contentService = {
  generateContent: async (request: ContentRequest): Promise<ContentResponse[]> => {
    const response = await api.post('/content/generate', request)
    return response.data
  },

  getABTestResults: async (testId: string): Promise<ABTestResults> => {
    const response = await api.get(`/content/ab-test/${testId}`)
    return response.data
  },

  recordMetrics: async (testId: string, variantId: string, metricType: string, value: number) => {
    await api.post(`/content/ab-test/${testId}/metrics`, {
      variant_id: variantId,
      metric_type: metricType,
      value,
    })
  },
}
