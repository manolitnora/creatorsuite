export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  content: {
    list: '/content',
    create: '/content',
    update: '/content/:id',
    delete: '/content/:id',
    analyze: '/content/:id/analyze',
    schedule: '/content/:id/schedule',
  },
  campaigns: {
    list: '/campaigns',
    create: '/campaigns',
    update: '/campaigns/:id',
    delete: '/campaigns/:id',
    metrics: '/campaigns/:id/metrics',
    budget: '/campaigns/:id/budget',
  },
  abTesting: {
    list: '/ab-tests',
    create: '/ab-tests',
    update: '/ab-tests/:id',
    delete: '/ab-tests/:id',
    results: '/ab-tests/:id/results',
    start: '/ab-tests/:id/start',
    stop: '/ab-tests/:id/stop',
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    reports: '/analytics/reports',
    customReport: '/analytics/reports/custom',
    export: '/analytics/reports/:id/export',
  },
} as const;

export const getEndpoint = (path: string, params: Record<string, string> = {}) => {
  let endpoint = path;
  Object.entries(params).forEach(([key, value]) => {
    endpoint = endpoint.replace(`:${key}`, value);
  });
  return `${API_BASE_URL}/api/v1${endpoint}`;
};
