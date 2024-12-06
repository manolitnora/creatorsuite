import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { api } from '../../utils/api';
import { formatDate } from '../../utils/date';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ContentStats {
  id: string;
  title: string;
  platform: string;
  publishDate: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    averageTimeSpent: number;
  };
  performanceScore: number;
}

interface TimeSeriesData {
  timestamp: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

interface AudienceInsight {
  category: string;
  value: number;
  change: number;
}

export function ContentPerformance() {
  const { contentId } = useParams<{ contentId: string }>();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsight[]>([]);

  useEffect(() => {
    if (contentId) {
      fetchContentAnalytics();
    }
  }, [contentId, timeRange]);

  const fetchContentAnalytics = async () => {
    setLoading(true);
    try {
      const [stats, timeSeries, insights] = await Promise.all([
        api.get<ContentStats>(`/analytics/content/${contentId}`),
        api.get<TimeSeriesData[]>(`/analytics/content/${contentId}/timeseries`, {
          params: { timeRange },
        }),
        api.get<AudienceInsight[]>(`/analytics/content/${contentId}/audience`),
      ]);

      setContentStats(stats);
      setTimeSeriesData(timeSeries);
      setAudienceInsights(insights);
    } catch (error) {
      console.error('Error fetching content analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contentStats) {
    return <div>Content not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Content Overview */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{contentStats.title}</h1>
              <div className="mt-2 flex items-center space-x-4">
                <Badge variant="primary">{contentStats.platform}</Badge>
                <span className="text-sm text-gray-500">
                  Published {formatDate(contentStats.publishDate)}
                </span>
              </div>
            </div>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Views</h3>
            <p className="mt-1 text-2xl font-semibold">
              {contentStats.metrics.views.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
            <p className="mt-1 text-2xl font-semibold">
              {contentStats.metrics.engagementRate.toFixed(2)}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Avg. Time Spent</h3>
            <p className="mt-1 text-2xl font-semibold">
              {contentStats.metrics.averageTimeSpent}s
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Performance Score</h3>
            <p className="mt-1 text-2xl font-semibold">
              {contentStats.performanceScore}/100
            </p>
          </div>
        </Card>
      </div>

      {/* Engagement Over Time */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#8884d8"
                  name="Likes"
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#82ca9d"
                  name="Comments"
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="#ffc658"
                  name="Shares"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Audience Insights */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Audience Insights</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceInsights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Value" />
                <Bar dataKey="change" fill="#82ca9d" name="Change %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Engagement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Engagement Sources</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Direct</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Hashtags</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shares</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Other</span>
                <span className="font-medium">10%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 dark:text-green-300">
                  What Worked Well
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-green-600 dark:text-green-200">
                  <li>• Strong engagement in first 2 hours</li>
                  <li>• High share rate among target demographic</li>
                  <li>• Effective hashtag usage</li>
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-700 dark:text-yellow-300">
                  Areas for Improvement
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-yellow-600 dark:text-yellow-200">
                  <li>• Lower than average comment rate</li>
                  <li>• Limited reach in key markets</li>
                  <li>• Timing could be optimized</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
