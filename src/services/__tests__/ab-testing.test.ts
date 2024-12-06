import { vi, describe, it, expect, beforeEach } from 'vitest';
import { abTestingService } from '../ab-testing';
import { api } from '../../utils/api';

// Mock the API module
vi.mock('../../utils/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ABTestingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTests', () => {
    it('should fetch tests with valid params', async () => {
      const mockTests = [{ id: '1', name: 'Test 1' }];
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockTests });

      const result = await abTestingService.getTests({
        status: 'running',
        platform: 'facebook',
        skip: 0,
        limit: 10,
      });

      expect(api.get).toHaveBeenCalledWith('/api/v1/ab-testing/tests', {
        params: {
          status: 'running',
          platform: 'facebook',
          skip: 0,
          limit: 10,
        },
      });
      expect(result).toEqual(mockTests);
    });

    it('should throw error for invalid params', async () => {
      await expect(
        abTestingService.getTests({
          status: 'invalid' as any,
          limit: -1,
        })
      ).rejects.toThrow('Validation error');
    });
  });

  describe('createTest', () => {
    it('should create test with valid data', async () => {
      const mockTest = { id: '1', name: 'New Test' };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockTest });

      const testData = {
        name: 'New Test',
        platform: 'facebook',
        min_sample_size: 1000,
        max_duration_hours: 24,
        metrics_weights: { engagement: 0.5, clicks: 0.5 },
      };

      const result = await abTestingService.createTest(testData);

      expect(api.post).toHaveBeenCalledWith('/api/v1/ab-testing/tests', testData);
      expect(result).toEqual(mockTest);
    });

    it('should throw error for invalid test data', async () => {
      await expect(
        abTestingService.createTest({
          name: '', // Invalid: empty name
          platform: 'facebook',
          min_sample_size: 0, // Invalid: too small
          max_duration_hours: 24,
          metrics_weights: { engagement: 1.5 }, // Invalid: weight > 1
        } as any)
      ).rejects.toThrow('Validation error');
    });
  });

  describe('updateTest', () => {
    it('should update test with valid data', async () => {
      const mockTest = { id: '1', name: 'Updated Test' };
      vi.mocked(api.put).mockResolvedValueOnce({ data: mockTest });

      const testData = {
        name: 'Updated Test',
        status: 'paused' as const,
      };

      const result = await abTestingService.updateTest('1', testData);

      expect(api.put).toHaveBeenCalledWith('/api/v1/ab-testing/tests/1', testData);
      expect(result).toEqual(mockTest);
    });

    it('should throw error for missing test ID', async () => {
      await expect(
        abTestingService.updateTest('', { name: 'Test' })
      ).rejects.toThrow('Test ID is required');
    });
  });

  describe('test lifecycle', () => {
    const testId = '1';

    it('should start test', async () => {
      const mockTest = { id: testId, status: 'running' };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockTest });

      const result = await abTestingService.startTest(testId);

      expect(api.post).toHaveBeenCalledWith(`/api/v1/ab-testing/tests/${testId}/start`);
      expect(result).toEqual(mockTest);
    });

    it('should pause test', async () => {
      const mockTest = { id: testId, status: 'paused' };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockTest });

      const result = await abTestingService.pauseTest(testId);

      expect(api.post).toHaveBeenCalledWith(`/api/v1/ab-testing/tests/${testId}/pause`);
      expect(result).toEqual(mockTest);
    });

    it('should end test', async () => {
      const mockTest = { id: testId, status: 'completed' };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockTest });

      const result = await abTestingService.endTest(testId);

      expect(api.post).toHaveBeenCalledWith(`/api/v1/ab-testing/tests/${testId}/end`);
      expect(result).toEqual(mockTest);
    });
  });

  describe('variants', () => {
    const testId = '1';
    const variantId = '2';

    it('should add variant', async () => {
      const mockTest = { id: testId, variants: [{ id: variantId }] };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockTest });

      const variantData = {
        content: 'Variant content',
        platform: 'facebook',
        is_control: true,
      };

      const result = await abTestingService.addVariant(testId, variantData);

      expect(api.post).toHaveBeenCalledWith(
        `/api/v1/ab-testing/tests/${testId}/variants`,
        variantData
      );
      expect(result).toEqual(mockTest);
    });

    it('should update variant', async () => {
      const mockTest = { id: testId, variants: [{ id: variantId, content: 'Updated' }] };
      vi.mocked(api.put).mockResolvedValueOnce({ data: mockTest });

      const variantData = {
        content: 'Updated content',
      };

      const result = await abTestingService.updateVariant(testId, variantId, variantData);

      expect(api.put).toHaveBeenCalledWith(
        `/api/v1/ab-testing/tests/${testId}/variants/${variantId}`,
        variantData
      );
      expect(result).toEqual(mockTest);
    });
  });

  describe('metrics and results', () => {
    const testId = '1';

    it('should fetch test results', async () => {
      const mockResults = { winner_variant_id: '1', confidence_level: 0.95 };
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResults });

      const result = await abTestingService.getTestResults(testId);

      expect(api.get).toHaveBeenCalledWith(`/api/v1/ab-testing/tests/${testId}/results`);
      expect(result).toEqual(mockResults);
    });

    it('should fetch test metrics with valid date range', async () => {
      const mockMetrics = [{ timestamp: '2024-01-01', values: { clicks: 100 } }];
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockMetrics });

      const params = {
        start_date: '2024-01-01',
        end_date: '2024-01-02',
        interval: 'day' as const,
      };

      const result = await abTestingService.getTestMetrics(testId, params);

      expect(api.get).toHaveBeenCalledWith(
        `/api/v1/ab-testing/tests/${testId}/metrics`,
        { params }
      );
      expect(result).toEqual(mockMetrics);
    });

    it('should throw error for invalid date format', async () => {
      await expect(
        abTestingService.getTestMetrics(testId, {
          start_date: 'invalid-date',
          interval: 'day',
        })
      ).rejects.toThrow('Validation error');
    });
  });
});
