import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { storage } from './storage';
import toast from 'react-hot-toast';

export class ApiService {
  private api: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(axiosInstance?: AxiosInstance) {
    // Allow injection of axios instance for testing
    this.api = axiosInstance || axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!this.api || !this.api.interceptors) {
      throw new Error('Failed to initialize axios instance');
    }

    this.setupInterceptors();
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private subscribeToTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private setupInterceptors() {
    if (!this.api?.interceptors) {
      return;
    }

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = storage.get<string>('auth_token');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Only attempt token refresh for 401 errors and non-refresh requests
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
          if (this.isRefreshing) {
            // Wait for the token refresh
            return new Promise((resolve) => {
              this.subscribeToTokenRefresh((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }
                resolve(this.api(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const token = await this.refreshToken();
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            this.isRefreshing = false;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any): never {
    if (error.isAxiosError) {
      if (error.response) {
        const message = error.response.data?.message || 'An error occurred';
        toast.error(message);
        throw new Error(message);
      }
      if (error.request) {
        const message = 'No response from server';
        toast.error(message);
        throw new Error(message);
      }
    }
    const message = error.message || 'Unknown error';
    toast.error(message);
    throw new Error(message);
  }

  private async refreshToken() {
    try {
      const refreshToken = storage.get<string>('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.api.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token } = response.data;
      if (!access_token) {
        throw new Error('Invalid refresh token response');
      }

      storage.set('auth_token', access_token);
      this.onRefreshed(access_token);
      return access_token;
    } catch (error) {
      storage.remove('auth_token');
      storage.remove('refresh_token');
      throw error;
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 && !error.config?._retry) {
        try {
          const token = await this.refreshToken();
          const newConfig = {
            ...config,
            headers: {
              ...config?.headers,
              Authorization: `Bearer ${token}`
            }
          };
          const response = await this.api.get(url, newConfig);
          return response.data;
        } catch (refreshError) {
          return this.handleError(refreshError);
        }
      }
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.put(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete(url, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}

// Create and export a singleton instance for production use
export const api = new ApiService();
