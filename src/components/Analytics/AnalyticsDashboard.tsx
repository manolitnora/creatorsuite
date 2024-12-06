import React, { useState } from 'react';
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
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { DateRangePicker } from '../common/DateRangePicker';
import { ABTestingInsights } from './ABTestingInsights';
import { ParetoAnalysis } from './ParetoAnalysis';
import { ReportGenerator } from './ReportGenerator';
import { useContentPerformance } from '../../hooks/useAnalytics';

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    new Date()
  ]);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'testing'>('overview');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const { data: performance, isLoading } = useContentPerformance({
    startDate: dateRange[0].toISOString(),
    endDate: dateRange[1].toISOString(),
    groupBy
  });

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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'content', label: 'Content Performance' },
            { id: 'testing', label: 'A/B Testing Insights' }
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        />
        
        <div className="flex items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          {activeTab !== 'testing' && (
            <div className="flex gap-2">
              {(['day', 'week', 'month'] as const).map((interval) => (
                <Button
                  key={interval}
                  variant={groupBy === interval ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setGroupBy(interval)}
                >
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && performance && (
        <div className="space-y-6">
          {/* Overall Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(performance.overall_metrics).map(([metric, value]) => (
              <Card key={metric}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {metric.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h3>
                  <div className="text-3xl font-bold text-primary-600">
                    {typeof value === 'number' 
                      ? value.toLocaleString(undefined, {
                          maximumFractionDigits: 2
                        })
                      : value}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Performance Trends */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performance.trend_analysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dates" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#4F46E5"
                      name="Engagement"
                    />
                    <Line
                      type="monotone"
                      dataKey="conversion"
                      stroke="#10B981"
                      name="Conversion"
                    />
                    <Line
                      type="monotone"
                      dataKey="reach"
                      stroke="#F59E0B"
                      name="Reach"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Platform Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(performance.platform_breakdown).map(
                      ([platform, metrics]) => ({
                        platform,
                        ...metrics
                      })
                    )}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="engagement" fill="#4F46E5" name="Engagement" />
                      <Bar dataKey="conversion" fill="#10B981" name="Conversion" />
                      <Bar dataKey="reach" fill="#F59E0B" name="Reach" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">A/B Testing Impact</h3>
                <div className="space-y-4">
                  {Object.entries(performance.ab_test_impact.improvement).map(
                    ([metric, improvement]) => (
                      <div key={metric} className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </span>
                        <span className={`font-semibold ${
                          improvement > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                        </span>
                      </div>
                    )
                  )}
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Based on {performance.ab_test_impact.tested_count} tested vs{' '}
                      {performance.ab_test_impact.untested_count} untested content items
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Content Performance Tab */}
      {activeTab === 'content' && performance && (
        <div className="space-y-6">
          {/* Top Performing Content */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
              <div className="space-y-4">
                {performance.top_performing_content.map((content, index) => (
                  <div
                    key={content.content_id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold text-gray-400">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{content.content_id}</div>
                        <div className="text-sm text-gray-500">
                          {content.platform} • {new Date(content.publish_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      {Object.entries(content.metrics).map(([metric, value]) => (
                        <div key={metric} className="text-right">
                          <div className="text-sm text-gray-500">{metric}</div>
                          <div className="font-medium">{value.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pareto Analysis</h3>
              <div className="h-80">
                <ParetoAnalysis platform={performance.platform_breakdown} />
              </div>
            </div>
          </Card>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ReportGenerator platform={selectedPlatform} />
            </Grid>
          </Grid>
        </div>
      )}

      {/* A/B Testing Insights Tab */}
      {activeTab === 'testing' && (
        <ABTestingInsights
          startDate={dateRange[0].toISOString()}
          endDate={dateRange[1].toISOString()}
        />
      )}
    </div>
  );
}
