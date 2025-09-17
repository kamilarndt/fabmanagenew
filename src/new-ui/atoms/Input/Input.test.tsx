import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('h-10', 'px-3', 'py-2')
  })

  it('renders with label', () => {
    render(<Input label="Test Label" placeholder="Enter text" />)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('renders with required indicator', () => {
    render(<Input label="Test Label" required placeholder="Enter text" />)
    
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-destructive')
  })

  it('renders with error message', () => {
    render(<Input error="This field is required" placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    const errorMessage = screen.getByText('This field is required')
    
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-destructive')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('border-destructive')
  })

  it('renders with helper text', () => {
    render(<Input helperText="This is helper text" placeholder="Enter text" />)
    
    const helperText = screen.getByText('This is helper text')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('text-muted-foreground')
  })

  it('renders with icon on the left', () => {
    const icon = <span data-testid="icon">🔍</span>
    render(<Input icon={icon} iconPosition="left" placeholder="Enter text" />)
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('pl-10')
  })

  it('renders with icon on the right', () => {
    const icon = <span data-testid="icon">🔍</span>
    render(<Input icon={icon} iconPosition="right" placeholder="Enter text" />)
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('pr-10')
  })

  it('applies correct size variants', () => {
    const { rerender } = render(<Input size="sm" placeholder="Small" />)
    expect(screen.getByPlaceholderText('Small')).toHaveClass('h-8', 'px-2', 'py-1', 'text-xs')

    rerender(<Input size="lg" placeholder="Large" />)
    expect(screen.getByPlaceholderText('Large')).toHaveClass('h-12', 'px-4', 'py-3', 'text-base')
  })

  it('applies correct variant styles', () => {
    const { rerender } = render(<Input variant="destructive" placeholder="Destructive" />)
    expect(screen.getByPlaceholderText('Destructive')).toHaveClass('border-destructive', 'text-destructive')

    rerender(<Input variant="success" placeholder="Success" />)
    expect(screen.getByPlaceholderText('Success')).toHaveClass('border-green-500', 'text-green-700')

    rerender(<Input variant="warning" placeholder="Warning" />)
    expect(screen.getByPlaceholderText('Warning')).toHaveClass('border-yellow-500', 'text-yellow-700')
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    await user.type(input, 'Hello World')
    
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('Hello World')
  })

  it('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalled()
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} placeholder="Enter text" />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('has correct accessibility attributes', () => {
    render(
      <Input
        label="Test Label"
        error="Error message"
        helperText="Helper text"
        required
        placeholder="Enter text"
      />
    )
    
    const input = screen.getByPlaceholderText('Enter text')
    const label = screen.getByText('Test Label')
    const errorMessage = screen.getByText('Error message')
    const helperText = screen.getByText('Helper text')
    
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
    expect(label).toHaveAttribute('for', input.id)
    expect(errorMessage).toHaveAttribute('role', 'alert')
  })

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Enter password" />)
    expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Enter number" />)
    expect(screen.getByPlaceholderText('Enter number')).toHaveAttribute('type', 'number')
  })
})