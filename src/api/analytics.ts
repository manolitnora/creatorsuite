import { axiosInstance } from './axiosInstance';

interface ParetoAnalysisParams {
  platform?: string;
  metric?: string;
  startDate?: Date;
  endDate?: Date;
}

export const fetchParetoAnalysis = async ({
  platform,
  metric = 'engagement',
  startDate,
  endDate,
}: ParetoAnalysisParams) => {
  const params = new URLSearchParams();
  
  if (platform) params.append('platform', platform);
  if (metric) params.append('metric', metric);
  if (startDate) params.append('start_date', startDate.toISOString());
  if (endDate) params.append('end_date', endDate.toISOString());

  const response = await axiosInstance.get(`/api/v1/analytics/pareto-analysis?${params}`);
  return response.data;
};
