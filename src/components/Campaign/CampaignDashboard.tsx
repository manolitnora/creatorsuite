import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CampaignMetrics {
  date: string;
  engagement: number;
  reach: number;
  clicks: number;
  conversions: number;
}

interface CampaignDashboardProps {
  campaign: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    platforms: string[];
    budget: number;
    goals: {
      engagement: number;
      reach: number;
      clicks: number;
      conversions: number;
    };
    metrics: CampaignMetrics[];
  };
}

export const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaign
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('engagement');
  const [timeRange, setTimeRange] = useState<string>('7d');

  const metrics = [
    { id: 'engagement', name: 'Engagement Rate', format: '%' },
    { id: 'reach', name: 'Reach', format: '' },
    { id: 'clicks', name: 'Click-through Rate', format: '%' },
    { id: 'conversions', name: 'Conversion Rate', format: '%' }
  ];

  const timeRanges = [
    { id: '7d', name: 'Last 7 days' },
    { id: '30d', name: 'Last 30 days' },
    { id: 'all', name: 'All time' }
  ];

  const calculateProgress = (metric: string) => {
    const current = campaign.metrics.reduce((sum, m) => sum + m[metric as keyof CampaignMetrics], 0);
    const goal = campaign.goals[metric as keyof typeof campaign.goals];
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
            <p className="text-sm text-gray-500">
              {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            {campaign.platforms.map(platform => (
              <span
                key={platform}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {campaign.metrics[campaign.metrics.length - 1][metric.id as keyof CampaignMetrics]}
                    {metric.format}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${calculateProgress(metric.id)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {calculateProgress(metric.id)}% of goal
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
            {metrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedMetric === metric.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {metric.name}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            {timeRanges.map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeRange === range.id
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={campaign.metrics}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CampaignDashboard;
