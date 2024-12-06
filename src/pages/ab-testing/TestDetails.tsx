import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tooltip } from '../../components/common/Tooltip';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TestVariant {
  id: string;
  content: string;
  description: string;
  metrics: {
    impressions: number;
    conversions: number;
    conversionRate: number;
  };
}

interface TestData {
  id: string;
  name: string;
  description: string;
  type: string;
  goal: string;
  targetAudience: string;
  duration: number;
  sampleSize: number;
  variants: TestVariant[];
  successMetric: string;
  minimumConfidence: number;
  status: 'running' | 'completed' | 'paused';
  startDate: string;
  endDate: string | null;
  winner?: string;
  confidenceLevel: number;
  timeSeriesData: Array<{
    date: string;
    [key: string]: number | string;
  }>;
}

export function TestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestData();
  }, [id]);

  const fetchTestData = async () => {
    try {
      const response = await api.get(`/ab-testing/tests/${id}`);
      setTest(response.data);
    } catch (error) {
      toast.error('Failed to fetch test data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'running' | 'paused') => {
    try {
      await api.patch(`/ab-testing/tests/${id}/status`, { status: newStatus });
      setTest((prev) => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Test ${newStatus === 'running' ? 'resumed' : 'paused'} successfully`);
    } catch (error) {
      toast.error('Failed to update test status');
    }
  };

  const handleEndTest = async () => {
    if (!window.confirm('Are you sure you want to end this test?')) return;

    try {
      await api.patch(`/ab-testing/tests/${id}/end`);
      fetchTestData();
      toast.success('Test ended successfully');
    } catch (error) {
      toast.error('Failed to end test');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!test) {
    return <div>Test not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'completed':
        return 'primary';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{test.name}</h1>
          <p className="text-gray-500 mt-1">{test.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={getStatusColor(test.status)}>
            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
          </Badge>
          {test.status !== 'completed' && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  handleStatusChange(test.status === 'running' ? 'paused' : 'running')
                }
              >
                {test.status === 'running' ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="danger" onClick={handleEndTest}>
                End Test
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Test Type</h3>
            <p className="mt-1 text-lg font-semibold">{test.type}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Success Metric</h3>
            <p className="mt-1 text-lg font-semibold">
              {test.successMetric.replace('_', ' ').charAt(0).toUpperCase() +
                test.successMetric.slice(1)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Confidence Level</h3>
            <p className="mt-1 text-lg font-semibold">{test.confidenceLevel}%</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={test.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                {test.variants.map((variant, index) => (
                  <Line
                    key={variant.id}
                    type="monotone"
                    dataKey={variant.description}
                    stroke={`hsl(${index * 360 / test.variants.length}, 70%, 50%)`}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {test.variants.map((variant) => (
          <Card key={variant.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{variant.description}</h3>
                {test.winner === variant.id && (
                  <Badge variant="success">Winner</Badge>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Content</p>
                  <p className="mt-1">{variant.content}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Impressions</p>
                    <p className="text-lg font-semibold">
                      {variant.metrics.impressions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversions</p>
                    <p className="text-lg font-semibold">
                      {variant.metrics.conversions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Tooltip content="Number of conversions divided by number of impressions">
                      <div>
                        <p className="text-sm text-gray-500">Conversion Rate</p>
                        <p className="text-lg font-semibold">
                          {(variant.metrics.conversionRate * 100).toFixed(2)}%
                        </p>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
