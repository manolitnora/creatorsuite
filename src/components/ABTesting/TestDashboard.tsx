import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useABTests } from '../../hooks/useABTesting';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
import { Pagination } from '../common/Pagination';
import { Platform, TestStatus } from '../../types/ab-testing';
import { formatDate } from '../../utils/date';

const ITEMS_PER_PAGE = 10;

const statusColors: Record<TestStatus, string> = {
  draft: 'gray',
  running: 'success',
  paused: 'warning',
  completed: 'primary',
};

const platformIcons: Record<Platform, string> = {
  facebook: 'fab fa-facebook',
  instagram: 'fab fa-instagram',
  twitter: 'fab fa-twitter',
  linkedin: 'fab fa-linkedin',
};

interface TestMetric {
  timestamp: string;
  variantId: string;
  engagement: number;
  reach: number;
  clicks: number;
}

interface TestVariant {
  id: string;
  content: string;
  isControl: boolean;
  metrics: TestMetric[];
  sampleSize: number;
  confidence: number;
}

interface Test {
  id: string;
  name: string;
  description: string;
  platform: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  variants: TestVariant[];
  confidenceLevel: number;
  minSampleSize: number;
  metricsWeights: {
    engagement: number;
    reach: number;
    clicks: number;
  };
}

interface TestDashboardProps {
  test: Test;
  onStopTest?: () => void;
  onDeclareWinner?: (variantId: string) => void;
}

export const TestDashboard: React.FC<TestDashboardProps> = ({
  test,
  onStopTest,
  onDeclareWinner
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<TestStatus | ''>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | ''>('');

  const { data: tests, isLoading } = useABTests({
    status: selectedStatus || undefined,
    platform: selectedPlatform || undefined,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  });

  const handleCreateTest = () => {
    navigate('/ab-testing/create');
  };

  const handleViewTest = (id: string) => {
    navigate(`/ab-testing/${id}`);
  };

  const [selectedMetric, setSelectedMetric] = useState<'engagement' | 'reach' | 'clicks'>('engagement');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | 'all'>('24h');

  const metrics = [
    { id: 'engagement', name: 'Engagement Rate', color: '#4F46E5' },
    { id: 'reach', name: 'Reach', color: '#10B981' },
    { id: 'clicks', name: 'Click-through Rate', color: '#F59E0B' }
  ];

  const timeRanges = [
    { id: '1h', name: 'Last Hour' },
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: 'all', name: 'All Time' }
  ];

  const getFilteredMetrics = () => {
    const now = new Date();
    const filtered = test.variants.flatMap(variant =>
      variant.metrics.filter(metric => {
        const metricTime = new Date(metric.timestamp);
        switch (timeRange) {
          case '1h':
            return now.getTime() - metricTime.getTime() <= 3600000;
          case '24h':
            return now.getTime() - metricTime.getTime() <= 86400000;
          case '7d':
            return now.getTime() - metricTime.getTime() <= 604800000;
          default:
            return true;
        }
      })
    );
    return filtered;
  };

  const hasSignificantResult = test.variants.some(variant => variant.confidence >= 95);
  const bestPerformingVariant = test.variants.reduce((best, current) => {
    if (!best) return current;
    return current.metrics[current.metrics.length - 1][selectedMetric] >
           best.metrics[best.metrics.length - 1][selectedMetric] ? current : best;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-100 rounded-lg dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TestStatus)}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="running">Running</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
          >
            <option value="">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateTest}
          className="w-full sm:w-auto"
        >
          <i className="fas fa-plus mr-2" />
          Create New Test
        </Button>
      </div>

      {/* Test Cards Grid */}
      {tests?.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
              <i className="fas fa-flask text-2xl text-primary-600" />
            </div>
            <h3 className="text-lg font-medium">No Tests Found</h3>
            <p className="text-gray-500 max-w-md">
              Get started by creating your first A/B test to optimize your content
              performance.
            </p>
            <Button variant="primary" onClick={handleCreateTest}>
              Create Your First Test
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests?.map((test) => (
            <Card
              key={test.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleViewTest(test.id)}
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg line-clamp-1" title={test.name}>
                      {test.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2" title={test.description}>
                      {test.description}
                    </p>
                  </div>
                  <Tooltip content={test.platform}>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <i className={`${platformIcons[test.platform]} text-gray-600`} />
                    </div>
                  </Tooltip>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Sample Size</p>
                    <p className="font-medium">{test.min_sample_size.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{test.max_duration_hours}h</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Badge variant={statusColors[test.status]}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    Started {formatDate(test.start_time)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {tests && tests.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalItems={100} // Replace with actual total from API
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Real-time Metrics */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
            {metrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id as typeof selectedMetric)}
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
                onClick={() => setTimeRange(range.id as typeof timeRange)}
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
            <LineChart data={getFilteredMetrics()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
              />
              <Legend />
              {test.variants.map(variant => (
                <Line
                  key={variant.id}
                  type="monotone"
                  dataKey={selectedMetric}
                  data={variant.metrics}
                  name={variant.isControl ? 'Control' : `Variant ${variant.id}`}
                  stroke={variant.isControl ? '#4F46E5' : '#10B981'}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sample Size Progress */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Size Progress</h3>
        {test.variants.map(variant => {
          const progress = (variant.sampleSize / test.minSampleSize) * 100;
          return (
            <div key={variant.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {variant.isControl ? 'Control' : `Variant ${variant.id}`}
                </span>
                <span className="text-sm text-gray-500">
                  {variant.sampleSize} / {test.minSampleSize}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    variant.isControl ? 'bg-indigo-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Results */}
      {test.status !== 'running' && (
        <TestResults test={test} />
      )}
    </div>
  );
};

export default TestDashboard;
