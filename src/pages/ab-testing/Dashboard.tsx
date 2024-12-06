import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Select } from '../../components/common/Select';
import { api } from '../../utils/api';
import { formatDate } from '../../utils/date';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed' | 'stopped';
  startDate: string;
  endDate: string;
  variants: number;
  totalParticipants: number;
  winningVariant?: string;
  confidence: number;
  metrics: {
    conversionRate: number;
    improvement: number;
  };
}

interface TestMetrics {
  totalTests: number;
  activeTests: number;
  completedTests: number;
  averageImprovement: number;
}

export function ABTestingDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<ABTest[]>([]);
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [loading, setLoading] = useState({
    tests: true,
    metrics: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchData = async () => {
      try {
        setError(null);
        // Fetch tests
        const response = await api.get('/api/v1/ab-testing/tests', {
          params: {
            status: filter === 'all' ? undefined : filter,
          },
        });
        setTests(response.data);
        setLoading(prev => ({ ...prev, tests: false }));

        // Fetch metrics
        const metricsResponse = await api.get('/api/v1/ab-testing/metrics');
        setMetrics(metricsResponse.data);
        setLoading(prev => ({ ...prev, metrics: false }));

        // Subscribe to real-time updates
        unsubscribe = wsService.subscribe('ab_test_update', (data) => {
          if (data.type === 'test_update') {
            setTests(prev => prev.map(test => 
              test.id === data.test.id ? { ...test, ...data.test } : test
            ));
          } else if (data.type === 'metrics_update') {
            setMetrics(prev => ({ ...prev, ...data.metrics }));
          }
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        setLoading({ tests: false, metrics: false });
      }
    };

    fetchData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [filter]);

  const getStatusBadgeVariant = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'completed':
        return 'primary';
      case 'stopped':
        return 'danger';
      default:
        return 'default';
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading.metrics ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </Card>
            ))
          ) : metrics && (
            <>
              <Card>
                <div className="text-sm text-gray-500">Total Tests</div>
                <div className="text-2xl font-bold">{metrics.totalTests}</div>
              </Card>
              <Card>
                <div className="text-sm text-gray-500">Active Tests</div>
                <div className="text-2xl font-bold">{metrics.activeTests}</div>
              </Card>
              <Card>
                <div className="text-sm text-gray-500">Completed Tests</div>
                <div className="text-2xl font-bold">{metrics.completedTests}</div>
              </Card>
              <Card>
                <div className="text-sm text-gray-500">Avg. Improvement</div>
                <div className="text-2xl font-bold">
                  {metrics.averageImprovement.toFixed(1)}%
                </div>
              </Card>
            </>
          )}
        </div>

        <Card className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tests Overview</h2>
            <div className="flex gap-4">
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Tests' },
                  { value: 'running', label: 'Running' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'draft', label: 'Drafts' },
                ]}
              />
              <Button onClick={() => navigate('/ab-testing/create')}>
                New Test
              </Button>
            </div>
          </div>

          {loading.tests ? (
            <div className="animate-pulse">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
              ))}
            </div>
          ) : (
            <Table
              data={tests}
              columns={[
                {
                  header: 'Name',
                  cell: (row) => (
                    <div className="flex items-center">
                      <span className="font-medium">{row.name}</span>
                      <Badge
                        className="ml-2"
                        variant={getStatusBadgeVariant(row.status)}
                      >
                        {row.status}
                      </Badge>
                    </div>
                  ),
                },
                {
                  header: 'Duration',
                  cell: (row) => (
                    <div>
                      {formatDate(row.startDate)} - {formatDate(row.endDate)}
                    </div>
                  ),
                },
                {
                  header: 'Variants',
                  cell: (row) => row.variants,
                },
                {
                  header: 'Participants',
                  cell: (row) => row.totalParticipants.toLocaleString(),
                },
                {
                  header: 'Conversion Rate',
                  cell: (row) => `${row.metrics.conversionRate.toFixed(2)}%`,
                },
                {
                  header: 'Improvement',
                  cell: (row) => (
                    <span className={row.metrics.improvement > 0 ? 'text-green-500' : 'text-red-500'}>
                      {row.metrics.improvement > 0 ? '+' : ''}
                      {row.metrics.improvement.toFixed(2)}%
                    </span>
                  ),
                },
                {
                  header: 'Actions',
                  cell: (row) => (
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/ab-testing/${row.id}`)}
                    >
                      View Details
                    </Button>
                  ),
                },
              ]}
              onRowClick={(row) => navigate(`/ab-testing/${row.id}`)}
            />
          )}
        </Card>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">A/B Testing Dashboard</h1>
      {renderContent()}
    </div>
  );
}
