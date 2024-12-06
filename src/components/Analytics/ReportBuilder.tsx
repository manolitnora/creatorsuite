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

interface Metric {
  id: string;
  name: string;
  category: 'content' | 'campaign' | 'engagement' | 'platform';
}

interface Filter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: string | number;
}

interface ReportConfig {
  title: string;
  description: string;
  metrics: string[];
  filters: Filter[];
  groupBy: string[];
  chartType: 'line' | 'bar' | 'pie';
  dateRange: [Date, Date];
}

interface ReportBuilderProps {
  onGenerateReport: (config: ReportConfig) => void;
  availableMetrics: Metric[];
  isLoading?: boolean;
}

const CHART_TYPES = [
  { id: 'line', name: 'Line Chart' },
  { id: 'bar', name: 'Bar Chart' },
  { id: 'pie', name: 'Pie Chart' },
];

const OPERATORS = [
  { id: 'equals', name: 'Equals' },
  { id: 'contains', name: 'Contains' },
  { id: 'greater', name: 'Greater Than' },
  { id: 'less', name: 'Less Than' },
];

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  onGenerateReport,
  availableMetrics,
  isLoading = false,
}) => {
  const [config, setConfig] = useState<ReportConfig>({
    title: '',
    description: '',
    metrics: [],
    filters: [],
    groupBy: [],
    chartType: 'line',
    dateRange: [new Date(), new Date()],
  });

  const handleMetricToggle = (metricId: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(id => id !== metricId)
        : [...prev.metrics, metricId],
    }));
  };

  const addFilter = () => {
    setConfig(prev => ({
      ...prev,
      filters: [
        ...prev.filters,
        { field: availableMetrics[0].id, operator: 'equals', value: '' },
      ],
    }));
  };

  const removeFilter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }));
  };

  const updateFilter = (index: number, field: keyof Filter, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) =>
        i === index ? { ...filter, [field]: value } : filter
      ),
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Custom Report Builder</h2>

      {/* Basic Information */}
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Report Title
          </label>
          <input
            type="text"
            id="title"
            value={config.title}
            onChange={e => setConfig(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={config.description}
            onChange={e => setConfig(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Metrics Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Select Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableMetrics.map(metric => (
            <div key={metric.id} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={`metric-${metric.id}`}
                  type="checkbox"
                  checked={config.metrics.includes(metric.id)}
                  onChange={() => handleMetricToggle(metric.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`metric-${metric.id}`} className="font-medium text-gray-700">
                  {metric.name}
                </label>
                <p className="text-gray-500">{metric.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
          <button
            type="button"
            onClick={addFilter}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Filter
          </button>
        </div>
        <div className="space-y-4">
          {config.filters.map((filter, index) => (
            <div key={index} className="flex items-center space-x-4">
              <select
                value={filter.field}
                onChange={e => updateFilter(index, 'field', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {availableMetrics.map(metric => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
              <select
                value={filter.operator}
                onChange={e => updateFilter(index, 'operator', e.target.value as Filter['operator'])}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {OPERATORS.map(op => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={filter.value}
                onChange={e => updateFilter(index, 'value', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeFilter(index)}
                className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Type Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Chart Type</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CHART_TYPES.map(type => (
            <div key={type.id} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={`chart-${type.id}`}
                  type="radio"
                  checked={config.chartType === type.id}
                  onChange={() => setConfig(prev => ({ ...prev, chartType: type.id as ReportConfig['chartType'] }))}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`chart-${type.id}`} className="font-medium text-gray-700">
                  {type.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Date Range</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={config.dateRange[0].toISOString().split('T')[0]}
              onChange={e => setConfig(prev => ({
                ...prev,
                dateRange: [new Date(e.target.value), prev.dateRange[1]],
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={config.dateRange[1].toISOString().split('T')[0]}
              onChange={e => setConfig(prev => ({
                ...prev,
                dateRange: [prev.dateRange[0], new Date(e.target.value)],
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onGenerateReport(config)}
          disabled={isLoading || config.metrics.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportBuilder;
