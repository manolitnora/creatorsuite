import { useQuery } from 'react-query';
import { api } from '../utils/api';

export interface ContentPerformanceParams {
  platform?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface ABTestingInsightsParams {
  startDate?: string;
  endDate?: string;
}

export function useContentPerformance(params: ContentPerformanceParams = {}) {
  return useQuery(
    ['content-performance', params],
    () => api.get('/api/v1/analytics/content-performance', { params }).then(res => res.data),
    {
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    }
  );
}

export function useABTestingInsights(params: ABTestingInsightsParams = {}) {
  return useQuery(
    ['ab-testing-insights', params],
    () => api.get('/api/v1/analytics/ab-testing-insights', { params }).then(res => res.data),
    {
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    }
  );
}
