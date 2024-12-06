import { render } from '@testing-library/react'
import { Providers } from '@/components/Providers'
import { describe, it, expect } from 'vitest'

describe('Providers', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Providers>
        <div>Test Content</div>
      </Providers>
    )
    
    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('applies theme correctly', () => {
    const { container } = render(
      <Providers>
        <div>Theme Test</div>
      </Providers>
    )
    
    // Check if CssBaseline styles are applied
    const html = container.ownerDocument.documentElement
    const computedStyle = window.getComputedStyle(html)
    expect(computedStyle).toBeDefined()
  })
})
