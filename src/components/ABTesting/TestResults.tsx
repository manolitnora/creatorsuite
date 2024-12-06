import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useABTest,
  useABTestResults,
  useABTestMetrics,
  useEndABTest,
  useTestStatus,
} from '../../hooks/useABTesting';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
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
import { formatDate } from '../../utils/date';

interface Props {
  testId: string;
}

interface StatisticalAnalysis {
  statistical_significance: {
    p_value: number;
    t_statistic: number;
    is_significant: boolean;
  };
  effect_size: number;
  control_confidence_interval: {
    lower: number;
    upper: number;
  };
  variant_confidence_interval: {
    lower: number;
    upper: number;
  };
  sample_sizes: {
    control: number;
    variant: number;
  };
}

interface VariantPerformance {
  metrics: number[];
  analysis?: StatisticalAnalysis;
}

interface TestResultsData {
  test_id: string;
  status: string;
  start_time: string;
  end_time?: string;
  variants_performance: Record<string, VariantPerformance>;
  control_variant_id: string;
  sample_sizes: Record<string, number>;
}

interface TestStatus {
  current_status: string;
  should_stop: boolean;
  reason: string;
  winning_variant_id?: string;
  confidence_level?: number;
}

function StatisticalInsights({ analysis }: { analysis: StatisticalAnalysis }) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Statistical Analysis</h3>
        <Badge
          variant={analysis.statistical_significance.is_significant ? "success" : "warning"}
          label={analysis.statistical_significance.is_significant ? "Significant" : "Not Significant"}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">P-Value</label>
          <div className="font-mono">
            {analysis.statistical_significance.p_value.toFixed(4)}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Effect Size</label>
          <div className="font-mono">
            {analysis.effect_size.toFixed(2)}
            <Tooltip content="Cohen's d effect size: <0.2 (small), 0.2-0.5 (medium), >0.8 (large)" />
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Control CI (95%)</label>
          <div className="font-mono">
            [{analysis.control_confidence_interval.lower.toFixed(2)}, 
             {analysis.control_confidence_interval.upper.toFixed(2)}]
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Variant CI (95%)</label>
          <div className="font-mono">
            [{analysis.variant_confidence_interval.lower.toFixed(2)}, 
             {analysis.variant_confidence_interval.upper.toFixed(2)}]
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-sm text-gray-600">Sample Sizes</div>
        <div className="grid grid-cols-2 gap-2">
          <div>Control: {analysis.sample_sizes.control}</div>
          <div>Variant: {analysis.sample_sizes.variant}</div>
        </div>
      </div>
    </div>
  );
}

function TestStatusInfo({ testId }: { testId: string }) {
  const { data: status } = useTestStatus(testId);

  if (!status) return null;

  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Test Status</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Status:</span>
          <Badge variant={status.current_status} label={status.current_status} />
        </div>
        
        {status.should_stop && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recommended Action:</span>
              <Badge variant="warning" label="Stop Test" />
            </div>
            <div className="text-sm text-gray-600">
              Reason: {status.reason}
            </div>
            {status.winning_variant_id && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Winning Variant:</span>
                <span className="font-medium">{status.winning_variant_id}</span>
              </div>
            )}
            {status.confidence_level && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Confidence Level:</span>
                <span className="font-medium">{(status.confidence_level * 100).toFixed(1)}%</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function TestResults({ testId }: Props) {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string>('engagement');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  const { data: test, isLoading: isLoadingTest } = useABTest(testId);
  const { data: results } = useABTestResults(testId);
  const { data: metrics } = useABTestMetrics(testId, {
    interval: timeRange === '24h' ? 'hour' : 'day',
  });

  const endTestMutation = useEndABTest(testId);

  if (isLoadingTest) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg" />
        <div className="h-96 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (!test) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-2xl text-red-600" />
          </div>
          <h3 className="text-lg font-medium">Test Not Found</h3>
          <p className="text-gray-500">
            The test you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button variant="primary" onClick={() => navigate('/ab-testing')}>
            Back to Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  const handleEndTest = async () => {
    if (window.confirm('Are you sure you want to end this test?')) {
      await endTestMutation.mutateAsync();
    }
  };

  const getConfidenceLevelColor = (level: number) => {
    if (level >= 95) return 'success';
    if (level >= 90) return 'warning';
    return 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Test Overview Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{test.name}</h2>
            <Badge variant={test.status} label={test.status} />
          </div>
          
          <p className="text-gray-600 mb-4">{test.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Started:</span>{" "}
              {formatDate(results.start_time)}
            </div>
            {results.end_time && (
              <div>
                <span className="text-gray-600">Ended:</span>{" "}
                {formatDate(results.end_time)}
              </div>
            )}
          </div>
          
          {/* Add Test Status Information */}
          <TestStatusInfo testId={testId} />
        </div>
      </Card>

      {/* Variants Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(results.variants_performance).map(([variantId, performance]) => (
          <Card key={variantId}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {variantId === results.control_variant_id ? "Control" : "Variant"}
              </h3>
              
              {/* Metrics Summary */}
              <div className="space-y-4 mb-6">
                {Object.entries(test.metrics_weights).map(([metric, weight]) => (
                  <Card
                    key={metric}
                    className={`cursor-pointer transition-all ${
                      selectedMetric === metric ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </h3>
                          <p className="mt-2 text-3xl font-semibold">
                            {results?.variants_performance[variantId].metrics[0].toFixed(2)}%
                          </p>
                        </div>
                        <Tooltip content={`Weight: ${(weight * 100).toFixed()}%`}>
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <i className="fas fa-balance-scale text-gray-600" />
                          </div>
                        </Tooltip>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-gray-500">
                          {results?.confidence_level ? (
                            <Badge
                              variant={getConfidenceLevelColor(results.confidence_level)}
                            >
                              {results.confidence_level}% Confidence
                            </Badge>
                          ) : (
                            'Collecting data...'
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Statistical Analysis */}
              {variantId !== results.control_variant_id && performance.analysis && (
                <StatisticalInsights analysis={performance.analysis} />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
