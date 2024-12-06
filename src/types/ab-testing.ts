export type TestStatus = 'draft' | 'running' | 'paused' | 'completed';
export type TestType = 'content' | 'layout' | 'cta' | 'timing';
export type SuccessMetric = 'engagement' | 'clicks' | 'conversions' | 'time_spent';
export type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

export interface TestMetric {
  id: string;
  variant_id: string;
  metric_type: string;
  value: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface TestVariant {
  id: string;
  test_id: string;
  content: string;
  platform: Platform;
  metadata?: Record<string, any>;
  predicted_performance: Record<string, number>;
  actual_performance?: Record<string, number>;
  is_control: boolean;
  start_time: string;
  end_time?: string;
  status: string;
  metrics: TestMetric[];
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  platform: Platform;
  user_id: string;
  min_sample_size: number;
  max_duration_hours: number;
  metrics_weights: Record<string, number>;
  start_time: string;
  end_time?: string;
  status: TestStatus;
  winner_variant_id?: string;
  confidence_level?: number;
  variants: TestVariant[];
}

export interface CreateABTestDTO {
  name: string;
  description?: string;
  platform: Platform;
  min_sample_size: number;
  max_duration_hours: number;
  metrics_weights: Record<string, number>;
}

export interface UpdateABTestDTO extends Partial<CreateABTestDTO> {
  status?: TestStatus;
  end_time?: string;
  winner_variant_id?: string;
  confidence_level?: number;
}

export interface CreateVariantDTO {
  content: string;
  platform: Platform;
  metadata?: Record<string, any>;
  predicted_performance: Record<string, number>;
  is_control: boolean;
}

export interface UpdateVariantDTO {
  actual_performance?: Record<string, number>;
  status?: string;
  end_time?: string;
}

export interface TestResults {
  test_id: string;
  status: TestStatus;
  start_time: string;
  end_time?: string;
  winner_variant_id?: string;
  confidence_level?: number;
  variants_performance: Record<string, Record<string, number>>;
  sample_sizes: Record<string, number>;
  duration_hours?: number;
}

export interface TestMetrics {
  variant_id: string;
  metrics: {
    timestamp: string;
    values: Record<string, number>;
  }[];
}
