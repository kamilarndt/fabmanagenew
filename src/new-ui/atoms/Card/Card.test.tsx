import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

describe('Card', () => {
  it('renders with default props', () => {
    render(<Card>Test content</Card>)
    
    const card = screen.getByText('Test content')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm', 'p-6')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Card variant="outlined">Outlined card</Card>)
    expect(screen.getByText('Outlined card')).toHaveClass('border-2')

    rerender(<Card variant="elevated">Elevated card</Card>)
    expect(screen.getByText('Elevated card')).toHaveClass('shadow-md')

    rerender(<Card variant="flat">Flat card</Card>)
    expect(screen.getByText('Flat card')).toHaveClass('shadow-none', 'border-0')
  })

  it('renders with different padding sizes', () => {
    const { rerender } = render(<Card padding="none">No padding</Card>)
    expect(screen.getByText('No padding')).toHaveClass('p-0')

    rerender(<Card padding="sm">Small padding</Card>)
    expect(screen.getByText('Small padding')).toHaveClass('p-4')

    rerender(<Card padding="lg">Large padding</Card>)
    expect(screen.getByText('Large padding')).toHaveClass('p-8')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Card ref={ref}>Test content</Card>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('accepts custom className', () => {
    render(<Card className="custom-class">Test content</Card>)
    
    const card = screen.getByText('Test content')
    expect(card).toHaveClass('custom-class')
  })
})

describe('CardHeader', () => {
  it('renders with default props', () => {
    render(<CardHeader>Header content</CardHeader>)
    
    const header = screen.getByText('Header content')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<CardHeader ref={ref}>Header content</CardHeader>)
    
    expect(ref).toHaveBeenCalled()
  })
})

describe('CardTitle', () => {
  it('renders with default props', () => {
    render(<CardTitle>Card Title</CardTitle>)
    
    const title = screen.getByText('Card Title')
    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H3')
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<CardTitle ref={ref}>Card Title</CardTitle>)
    
    expect(ref).toHaveBeenCalled()
  })
})

describe('CardDescription', () => {
  it('renders with default props', () => {
    render(<CardDescription>Card description</CardDescription>)
    
    const description = screen.getByText('Card description')
    expect(description).toBeInTheDocument()
    expect(description.tagName).toBe('P')
    expect(description).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<CardDescription ref={ref}>Card description</CardDescription>)
    
    expect(ref).toHaveBeenCalled()
  })
})

describe('CardContent', () => {
  it('renders with default props', () => {
    render(<CardContent>Content</CardContent>)
    
    const content = screen.getByText('Content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('pt-6')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<CardContent ref={ref}>Content</CardContent>)
    
    expect(ref).toHaveBeenCalled()
  })
})

describe('CardFooter', () => {
  it('renders with default props', () => {
    render(<CardFooter>Footer content</CardFooter>)
    
    const footer = screen.getByText('Footer content')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('flex', 'items-center', 'pt-6')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<CardFooter ref={ref}>Footer content</CardFooter>)
    
    expect(ref).toHaveBeenCalled()
  })
})

describe('Complete Card', () => {
  it('renders a complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
    expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})
