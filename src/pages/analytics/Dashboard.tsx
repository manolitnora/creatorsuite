import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { api } from '../../utils/api';
import { formatDate, formatRelativeTime } from '../../utils/date';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsMetrics {
  totalReach: number;
  totalEngagement: number;
  averageEngagementRate: number;
  topPerformingPlatform: string;
  contentGrowth: number;
}

interface PlatformMetrics {
  platform: string;
  reach: number;
  engagement: number;
  posts: number;
  growth: number;
}

interface ContentPerformance {
  id: string;
  title: string;
  platform: string;
  publishDate: string;
  reach: number;
  engagement: number;
  engagementRate: number;
}

interface AudienceData {
  age: { [key: string]: number };
  gender: { [key: string]: number };
  location: { [key: string]: number };
  interests: { [key: string]: number };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);
  const [topContent, setTopContent] = useState<ContentPerformance[]>([]);
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
  const [engagementTrend, setEngagementTrend] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [
        metricsData,
        platformData,
        contentData,
        audienceStats,
        trendData,
      ] = await Promise.all([
        api.get<AnalyticsMetrics>('/analytics/metrics', { params: { timeRange } }),
        api.get<PlatformMetrics[]>('/analytics/platforms', { params: { timeRange } }),
        api.get<ContentPerformance[]>('/analytics/top-content', { params: { timeRange } }),
        api.get<AudienceData>('/analytics/audience', { params: { timeRange } }),
        api.get('/analytics/engagement-trend', { params: { timeRange } }),
      ]);

      setMetrics(metricsData);
      setPlatformMetrics(platformData);
      setTopContent(contentData);
      setAudienceData(audienceStats);
      setEngagementTrend(trendData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const contentColumns = [
    {
      key: 'title',
      header: 'Content',
      render: (content: ContentPerformance) => (
        <div className="font-medium">{content.title}</div>
      ),
    },
    {
      key: 'platform',
      header: 'Platform',
      render: (content: ContentPerformance) => (
        <Badge variant="primary">{content.platform}</Badge>
      ),
    },
    {
      key: 'reach',
      header: 'Reach',
      render: (content: ContentPerformance) => (
        content.reach.toLocaleString()
      ),
    },
    {
      key: 'engagement',
      header: 'Engagement',
      render: (content: ContentPerformance) => (
        content.engagement.toLocaleString()
      ),
    },
    {
      key: 'engagementRate',
      header: 'Eng. Rate',
      render: (content: ContentPerformance) => (
        `${content.engagementRate.toFixed(2)}%`
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
          <Button
            variant="outline"
            onClick={() => fetchAnalyticsData()}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Reach</h3>
            <p className="mt-1 text-2xl font-semibold">
              {metrics?.totalReach.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Engagement</h3>
            <p className="mt-1 text-2xl font-semibold">
              {metrics?.totalEngagement.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
            <p className="mt-1 text-2xl font-semibold">
              {metrics?.averageEngagementRate.toFixed(2)}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Content Growth</h3>
            <p className="mt-1 text-2xl font-semibold">
              {metrics?.contentGrowth > 0 ? '+' : ''}
              {metrics?.contentGrowth}%
            </p>
          </div>
        </Card>
      </div>

      {/* Engagement Trend */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Engagement Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Platform Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reach" fill="#8884d8" name="Reach" />
                  <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(audienceData?.age || {}).map(([key, value]) => ({
                      name: key,
                      value,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {Object.entries(audienceData?.age || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Top Performing Content</h3>
          <Table
            data={topContent}
            columns={contentColumns}
            emptyMessage="No content data available"
          />
        </div>
      </Card>
    </div>
  );
}
