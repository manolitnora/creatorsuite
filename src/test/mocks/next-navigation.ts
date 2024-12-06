import { vi } from 'vitest'

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
}

export const mockPathname = '/dashboard'

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useSearchParams: () => null,
  useServerInsertedHTML: (callback: () => React.ReactNode) => {
    // Execute the callback but don't do anything with the result in tests
    callback()
    return null
  },
}))
