import { vi } from 'vitest';

const mockInterceptors = {
  request: { use: vi.fn(() => mockInterceptors.request) },
  response: { use: vi.fn(() => mockInterceptors.response) },
};

const mockInstance = {
  interceptors: mockInterceptors,
  request: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

const mockCreate = vi.fn(() => mockInstance);

export default {
  create: mockCreate,
  ...mockInstance,
};

export { mockInstance, mockInterceptors };
