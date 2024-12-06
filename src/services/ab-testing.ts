import { api } from '../utils/api';
import type {
  ABTest,
  CreateABTestDTO,
  UpdateABTestDTO,
  TestResults,
  TestMetrics,
  CreateVariantDTO,
  UpdateVariantDTO,
  TestStatus,
  Platform,
} from '../types/ab-testing';
import { z } from 'zod';

const BASE_URL = '/api/v1/ab-testing';

// Validation schemas
const testParamsSchema = z.object({
  status: z.enum(['draft', 'running', 'paused', 'completed']).optional(),
  platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin']).optional(),
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
});

const dateRangeSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  interval: z.enum(['hour', 'day', 'week']).optional(),
});

const createTestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin']),
  min_sample_size: z.number().min(100),
  max_duration_hours: z.number().min(1),
  metrics_weights: z.record(z.number().min(0).max(1)),
});

const updateTestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['draft', 'running', 'paused', 'completed']).optional(),
  end_time: z.string().optional(),
  winner_variant_id: z.string().uuid().optional(),
  confidence_level: z.number().min(0).max(1).optional(),
});

class ABTestingService {
  private validateParams<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  async getTests(params?: {
    status?: TestStatus;
    platform?: Platform;
    skip?: number;
    limit?: number;
  }): Promise<ABTest[]> {
    if (params) {
      this.validateParams(testParamsSchema, params);
    }
    const response = await api.get(`${BASE_URL}/tests`, { params });
    return response.data as ABTest[];
  }

  async getTest(id: string): Promise<ABTest> {
    if (!id) throw new Error('Test ID is required');
    const response = await api.get(`${BASE_URL}/tests/${id}`);
    return response.data as ABTest;
  }

  async createTest(data: CreateABTestDTO): Promise<ABTest> {
    const validatedData = this.validateParams(createTestSchema, data);
    const response = await api.post(`${BASE_URL}/tests`, validatedData);
    return response.data as ABTest;
  }

  async updateTest(id: string, data: UpdateABTestDTO): Promise<ABTest> {
    if (!id) throw new Error('Test ID is required');
    const validatedData = this.validateParams(updateTestSchema, data);
    const response = await api.put(`${BASE_URL}/tests/${id}`, validatedData);
    return response.data as ABTest;
  }

  async deleteTest(id: string): Promise<void> {
    if (!id) throw new Error('Test ID is required');
    await api.delete(`${BASE_URL}/tests/${id}`);
  }

  async startTest(id: string): Promise<ABTest> {
    if (!id) throw new Error('Test ID is required');
    const response = await api.post(`${BASE_URL}/tests/${id}/start`);
    return response.data as ABTest;
  }

  async pauseTest(id: string): Promise<ABTest> {
    if (!id) throw new Error('Test ID is required');
    const response = await api.post(`${BASE_URL}/tests/${id}/pause`);
    return response.data as ABTest;
  }

  async endTest(id: string): Promise<ABTest> {
    if (!id) throw new Error('Test ID is required');
    const response = await api.post(`${BASE_URL}/tests/${id}/end`);
    return response.data as ABTest;
  }

  async getTestResults(id: string): Promise<TestResults> {
    if (!id) throw new Error('Test ID is required');
    const response = await api.get(`${BASE_URL}/tests/${id}/results`);
    return response.data as TestResults;
  }

  async getTestMetrics(
    id: string,
    params?: {
      start_date?: string;
      end_date?: string;
      interval?: 'hour' | 'day' | 'week';
    }
  ): Promise<TestMetrics[]> {
    if (!id) throw new Error('Test ID is required');
    if (params) {
      this.validateParams(dateRangeSchema, params);
    }
    const response = await api.get(`${BASE_URL}/tests/${id}/metrics`, { params });
    return response.data as TestMetrics[];
  }

  async addVariant(testId: string, data: CreateVariantDTO): Promise<ABTest> {
    if (!testId) throw new Error('Test ID is required');
    const response = await api.post(`${BASE_URL}/tests/${testId}/variants`, data);
    return response.data as ABTest;
  }

  async updateVariant(
    testId: string,
    variantId: string,
    data: UpdateVariantDTO
  ): Promise<ABTest> {
    if (!testId) throw new Error('Test ID is required');
    if (!variantId) throw new Error('Variant ID is required');
    const response = await api.put(
      `${BASE_URL}/tests/${testId}/variants/${variantId}`,
      data
    );
    return response.data as ABTest;
  }

  async checkTestStatus(id: string): Promise<{ should_end: boolean; reason?: string }> {
    if (!id) throw new Error('Test ID is required');
    const response = await api.get(`${BASE_URL}/tests/${id}/status`);
    return response.data;
  }
}

export const abTestingService = new ABTestingService();
