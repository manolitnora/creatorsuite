import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import DashboardNavigation from '../DashboardNavigation'

describe('DashboardNavigation', () => {
  it('renders all navigation items', () => {
    renderWithProviders(<DashboardNavigation />)
    
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Content Generator')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('highlights current page', () => {
    renderWithProviders(<DashboardNavigation />, { pathname: '/dashboard/content' })
    
    const contentButton = screen.getByText('Content Generator').closest('a')
    expect(contentButton).toHaveClass('Mui-selected')
  })

  it('navigates to correct page on click', () => {
    const { mockRouter } = renderWithProviders(<DashboardNavigation />)
    
    screen.getByText('Content Generator').click()
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/content')
  })

  it('renders icons for each navigation item', () => {
    renderWithProviders(<DashboardNavigation />)
    
    expect(screen.getByTestId('DashboardIcon')).toBeInTheDocument()
    expect(screen.getByTestId('CreateIcon')).toBeInTheDocument()
    expect(screen.getByTestId('AnalyticsIcon')).toBeInTheDocument()
    expect(screen.getByTestId('SettingsIcon')).toBeInTheDocument()
  })
})
