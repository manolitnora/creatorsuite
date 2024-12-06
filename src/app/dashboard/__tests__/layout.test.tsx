import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { useMediaQuery } from '@mui/material'
import DashboardLayout from '../layout'

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material')
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  }
})

describe('DashboardLayout', () => {
  it('renders children content', () => {
    vi.mocked(useMediaQuery).mockReturnValue(false)
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders CreatorSuite title', () => {
    vi.mocked(useMediaQuery).mockReturnValue(false)
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    const titles = screen.getAllByText('CreatorSuite')
    expect(titles.length).toBeGreaterThan(0)
  })

  it('shows navigation drawer in desktop view', () => {
    vi.mocked(useMediaQuery).mockReturnValue(false) // Desktop view
    
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('toggles mobile menu on button click', () => {
    vi.mocked(useMediaQuery).mockReturnValue(true) // Mobile view
    
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    const menuButton = screen.getByLabelText('open drawer')
    fireEvent.click(menuButton)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
