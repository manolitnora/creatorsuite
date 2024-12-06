import { expect, vi, beforeEach, describe, it } from 'vitest';
import type { Mock } from 'vitest';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Mock modules
vi.mock('../storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  },
}));

// Import after mocks
import { storage } from '../storage';
import { ApiService } from '../api';

describe('API Utility', () => {
  let mockAxiosInstance: Partial<AxiosInstance>;
  let api: ApiService;
  let requestInterceptor: (config: any) => any;
  let responseInterceptor: (response: any) => any;
  let responseErrorInterceptor: (error: any) => any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create fresh mock instance for each test
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn((interceptor) => {
            requestInterceptor = interceptor;
            return () => {};
          }),
        },
        response: {
          use: vi.fn((interceptor, errorInterceptor) => {
            responseInterceptor = interceptor;
            responseErrorInterceptor = errorInterceptor;
            return () => {};
          }),
        },
      },
      request: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    // Create new API service instance with mock
    api = new ApiService(mockAxiosInstance as AxiosInstance);
  });

  describe('Error Handling', () => {
    it('should handle axios error with response', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Bad Request' },
        },
        isAxiosError: true,
      };

      (mockAxiosInstance.get as Mock).mockRejectedValueOnce(mockError);

      await expect(api.get('/test')).rejects.toThrow('Bad Request');
    });

    it('should handle network error', async () => {
      const mockError = {
        request: {},
        isAxiosError: true,
      };

      (mockAxiosInstance.get as Mock).mockRejectedValueOnce(mockError);

      await expect(api.get('/test')).rejects.toThrow('No response from server');
    });

    it('should handle unknown error', async () => {
      const mockError = new Error('Unknown error');
      (mockAxiosInstance.get as Mock).mockRejectedValueOnce(mockError);

      await expect(api.get('/test')).rejects.toThrow('Unknown error');
    });
  });

  describe('Token Management', () => {
    const mockAuthToken = 'test-auth-token';
    const mockRefreshToken = 'test-refresh-token';
    const mockNewAuthToken = 'new-auth-token';

    beforeEach(() => {
      vi.mocked(storage.get).mockImplementation((key: string) => {
        if (key === 'auth_token') return mockAuthToken;
        if (key === 'refresh_token') return mockRefreshToken;
        return null;
      });
    });

    it('should add auth header to requests', async () => {
      const mockResponse = { data: { success: true } };
      (mockAxiosInstance.request as Mock).mockResolvedValueOnce(mockResponse);

      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers['Authorization']).toBe(`Bearer ${mockAuthToken}`);
      expect(storage.get).toHaveBeenCalledWith('auth_token');
    });

    it('should handle 401 error and refresh token', async () => {
      const mockError = {
        response: { status: 401, data: { message: 'Unauthorized' } },
        config: { _retry: false },
        isAxiosError: true
      };

      const mockRefreshResponse = { 
        data: { access_token: mockNewAuthToken }
      };

      const mockSuccessResponse = { 
        data: { success: true }
      };

      (mockAxiosInstance.get as Mock)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockSuccessResponse);

      (mockAxiosInstance.post as Mock)
        .mockResolvedValueOnce(mockRefreshResponse);

      const result = await api.get('/test');

      expect(storage.get).toHaveBeenCalledWith('refresh_token');
      expect(storage.set).toHaveBeenCalledWith('auth_token', mockNewAuthToken);
      expect(result).toEqual({ success: true });
    });

    it('should handle failed token refresh', async () => {
      const mockError = {
        response: { status: 401, data: { message: 'Unauthorized' } },
        config: { _retry: false },
        isAxiosError: true
      };

      const mockRefreshError = {
        response: { 
          status: 400, 
          data: { message: 'Invalid refresh token' } 
        },
        isAxiosError: true
      };

      (mockAxiosInstance.get as Mock)
        .mockRejectedValueOnce(mockError);

      (mockAxiosInstance.post as Mock)
        .mockRejectedValueOnce(mockRefreshError);

      await expect(api.get('/test')).rejects.toThrow('Invalid refresh token');
      expect(storage.remove).toHaveBeenCalledWith('auth_token');
      expect(storage.remove).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('Request Methods', () => {
    it('should make GET requests', async () => {
      const mockResponse = { data: { success: true } };
      (mockAxiosInstance.get as Mock).mockResolvedValueOnce(mockResponse);

      const result = await api.get('/test');
      expect(result).toEqual({ success: true });
    });

    it('should make POST requests', async () => {
      const mockResponse = { data: { success: true } };
      (mockAxiosInstance.post as Mock).mockResolvedValueOnce(mockResponse);

      const result = await api.post('/test', { data: 'test' });
      expect(result).toEqual({ success: true });
    });

    it('should make PUT requests', async () => {
      const mockResponse = { data: { success: true } };
      (mockAxiosInstance.put as Mock).mockResolvedValueOnce(mockResponse);

      const result = await api.put('/test', { data: 'test' });
      expect(result).toEqual({ success: true });
    });

    it('should make DELETE requests', async () => {
      const mockResponse = { data: { success: true } };
      (mockAxiosInstance.delete as Mock).mockResolvedValueOnce(mockResponse);

      const result = await api.delete('/test');
      expect(result).toEqual({ success: true });
    });
  });
});
