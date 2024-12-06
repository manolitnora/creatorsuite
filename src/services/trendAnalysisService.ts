import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ContentAnalysis {
  features: {
    postLength: number;
    hashtagCount: number;
    emojiCount: number;
    mediaCount: number;
    hourOfDay: number;
    dayOfWeek: number;
    mentionsCount: number;
    linkCount: number;
  };
  predictions: {
    predictedLikes: number;
    predictedComments: number;
    predictedShares: number;
    predictedReach: number;
    confidenceScore: number;
  };
  trendAlignment: number;
  currentTrends: {
    trendingTopics: string[];
    trendingFormats: string[];
    trendingHashtags: string[];
  };
  optimizationSuggestions: string[];
}

export interface OptimalPostingTime {
  hour: number;
  day: number;
  expectedEngagement: number;
}

export interface TrendReport {
  platform: string;
  trendingTopics: string[];
  trendingFormats: string[];
  trendingHashtags: string[];
  optimalPostingTimes: OptimalPostingTime[];
  engagementPatterns: {
    hourlyPatterns: Record<number, number>;
    dailyPatterns: Record<number, number>;
  };
  recommendations: string[];
}

class TrendAnalysisService {
  async analyzeContent(content: string, platform: string): Promise<ContentAnalysis> {
    const response = await axios.post(`${API_BASE_URL}/api/v1/trends/analyze`, {
      content,
      platform,
    });
    return response.data;
  }

  async getOptimalPostingTimes(platform: string): Promise<OptimalPostingTime[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/trends/optimal-times/${platform}`
    );
    return response.data;
  }

  async getTrendReport(platform: string, days: number = 30): Promise<TrendReport> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/trends/report/${platform}`,
      {
        params: { days },
      }
    );
    return response.data;
  }

  async getHistoricalPerformance(
    platform: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/trends/historical-performance/${platform}`,
      {
        params: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      }
    );
    return response.data;
  }
}

export const trendAnalysisService = new TrendAnalysisService();
