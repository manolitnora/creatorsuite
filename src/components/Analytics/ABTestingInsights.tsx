import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useABTestingInsights } from '../../hooks/useAnalytics';

interface Props {
  startDate?: string;
  endDate?: string;
}

export function ABTestingInsights({ startDate, endDate }: Props) {
  const { data: insights, isLoading } = useABTestingInsights({ startDate, endDate });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-100 rounded-lg" />
          <div className="h-80 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      {/* Success Rate Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Test Success Rate</h3>
            <div className="text-3xl font-bold text-primary-600">
              {insights.test_success_rate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500 mt-2">
              of completed tests found a winning variant
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Average Improvements</h3>
            <div className="space-y-2">
              {Object.entries(insights.improvement_metrics).map(([metric, value]) => (
                <div key={metric} className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {metric.split('_')[1].charAt(0).toUpperCase() + 
                     metric.split('_')[1].slice(1)}
                  </span>
                  <span className="font-semibold text-primary-600">
                    +{value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Platform Effectiveness</h3>
            <div className="space-y-2">
              {Object.entries(insights.platform_effectiveness).map(([platform, rate]) => (
                <div key={platform} className="flex justify-between items-center">
                  <span className="text-gray-600">{platform}</span>
                  <span className="font-semibold text-primary-600">
                    {rate.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Test Duration Analysis */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Success Rate by Test Duration</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.test_duration_analysis.success_by_duration}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="duration_range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="success_rate"
                  fill="#4F46E5"
                  name="Success Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Winning Factors */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Key Success Factors</h3>
          <div className="space-y-4">
            {insights.winning_factors.map((factor, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{factor.factor}</span>
                  <Badge
                    variant={
                      factor.impact === 'High'
                        ? 'success'
                        : factor.impact === 'Medium'
                        ? 'warning'
                        : 'info'
                    }
                    label={factor.impact}
                  />
                </div>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
