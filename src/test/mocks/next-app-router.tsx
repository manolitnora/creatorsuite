import React from 'react'
import { vi } from 'vitest'

// Create a mock router
const createMockRouter = (pathname: string = '/dashboard') => ({
  back: vi.fn(),
  forward: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname,
})

// Create a mock app router context
export const createMockAppRouterContext = (pathname: string = '/dashboard') => {
  const router = createMockRouter(pathname)
  return {
    router,
    AppRouterContext: {
      Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
  }
}

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: () => createMockRouter(),
  usePathname: () => '/dashboard',
  useServerInsertedHTML: (callback: () => React.ReactNode) => {
    callback()
    return null
  },
}))

// Export mock functions for direct use in tests
export const mockRouter = createMockRouter()
export const mockPathname = '/dashboard'
