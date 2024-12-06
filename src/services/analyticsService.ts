import axios from 'axios';
import { API_BASE_URL } from '../config';

interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  metrics?: string[];
  filters?: {
    field: string;
    operator: string;
    value: string | number;
  }[];
  groupBy?: string[];
  platforms?: string[];
  campaignIds?: string[];
}

interface AnalyticsResponse {
  overview: {
    totalContent: number;
    totalCampaigns: number;
    activeTests: number;
    totalEngagement: number;
    engagementRate: number;
    reachRate: number;
  };
  performanceByPlatform: {
    platform: string;
    engagement: number;
    reach: number;
    clicks: number;
  }[];
  contentPerformance: {
    date: string;
    engagement: number;
    reach: number;
    clicks: number;
  }[];
  topContent: {
    id: string;
    title: string;
    platform: string;
    engagement: number;
    reach: number;
    clicks: number;
  }[];
  campaignMetrics: {
    campaignId: string;
    name: string;
    metrics: {
      date: string;
      value: number;
    }[];
  }[];
}

class AnalyticsService {
  private readonly baseUrl = `${API_BASE_URL}/api/v1/analytics`;

  async getDashboardData(params: AnalyticsParams): Promise<AnalyticsResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/dashboard`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async generateCustomReport(params: AnalyticsParams): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/reports/custom`, params);
      return response.data;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error;
    }
  }

  async getContentPerformance(contentId: string, params: AnalyticsParams): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/content/${contentId}/performance`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching content performance:', error);
      throw error;
    }
  }

  async getCampaignPerformance(campaignId: string, params: AnalyticsParams): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/campaigns/${campaignId}/performance`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
      throw error;
    }
  }

  async getABTestResults(testId: string, params: AnalyticsParams): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/ab-tests/${testId}/results`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching A/B test results:', error);
      throw error;
    }
  }

  async exportReport(reportId: string, format: 'csv' | 'pdf' | 'excel'): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseUrl}/reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  async getMetricDefinitions(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/metrics/definitions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching metric definitions:', error);
      throw error;
    }
  }

  async getAvailableMetrics(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/metrics/available`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available metrics:', error);
      throw error;
    }
  }

  async saveReportConfig(config: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/reports/configs`, config);
      return response.data;
    } catch (error) {
      console.error('Error saving report config:', error);
      throw error;
    }
  }

  async loadReportConfig(configId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/reports/configs/${configId}`);
      return response.data;
    } catch (error) {
      console.error('Error loading report config:', error);
      throw error;
    }
  }

  async scheduleReport(reportId: string, schedule: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/reports/${reportId}/schedule`, schedule);
      return response.data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
