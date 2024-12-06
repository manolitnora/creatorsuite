import { vi } from 'vitest';

const mockAxios = {
  create: vi.fn(() => ({
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    request: vi.fn(),
  })),
};

export default mockAxios;
