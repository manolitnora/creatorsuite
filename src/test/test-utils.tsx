import { vi } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeRegistry } from '@/theme/ThemeRegistry'

// Create mock functions
const mockPathname = vi.fn().mockReturnValue('/dashboard')
const mockRouter = {
  back: vi.fn(),
  forward: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname(),
  useServerInsertedHTML: (callback: () => React.ReactNode) => {
    callback()
    return null
  },
}))

// Mock Material-UI components and hooks
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material')
  return {
    ...actual,
    useMediaQuery: vi.fn().mockReturnValue(false),
    useTheme: () => ({
      breakpoints: {
        up: () => false,
        down: () => false,
      },
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          contrastText: '#ffffff',
        },
      },
      spacing: (value: number) => value * 8,
      zIndex: {
        drawer: 1200,
      },
    }),
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Drawer: ({ children, ...props }: any) => <div role="navigation" {...props}>{children}</div>,
    IconButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Typography: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    List: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    ListItem: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    ListItemButton: ({ children, selected, ...props }: any) => (
      <a className={selected ? 'Mui-selected' : ''} {...props}>{children}</a>
    ),
    ListItemIcon: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    ListItemText: ({ children, primary, ...props }: any) => <span {...props}>{primary || children}</span>,
    Paper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  }
})

interface RenderOptions {
  pathname?: string
}

// Create a wrapper component that provides the router context
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeRegistry>{children}</ThemeRegistry>
  )
}

// Update the mock router for each test
export function renderWithProviders(ui: React.ReactNode, { pathname = '/dashboard' }: RenderOptions = {}) {
  // Update pathname for this specific test
  mockPathname.mockReturnValue(pathname)

  return {
    ...render(ui, { wrapper: Wrapper }),
    mockRouter
  }
}
