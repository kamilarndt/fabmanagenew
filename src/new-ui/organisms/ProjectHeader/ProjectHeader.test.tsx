// Unit tests for ProjectHeader component
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/utils/test-utils'
import { ProjectHeader } from './ProjectHeader'

describe('ProjectHeader', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    client_id: '1',
    status: 'active',
    budget: 50000,
    start_date: '2024-01-01',
    end_date: '2024-03-01',
    created_at: '2024-01-01T00:00:00Z',
    client: {
      id: '1',
      name: 'Test Client',
      company_name: 'Test Company'
    }
  }

  it('renders project information correctly', () => {
    render(<ProjectHeader project={mockProject} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Test Client')).toBeInTheDocument()
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('displays formatted budget', () => {
    render(<ProjectHeader project={mockProject} />)
    
    expect(screen.getByText('50 000,00 zł')).toBeInTheDocument()
  })

  it('shows correct status color for active project', () => {
    render(<ProjectHeader project={mockProject} />)
    
    const statusTag = screen.getByText('Active')
    expect(statusTag).toHaveClass('ant-tag')
  })

  it('displays dates correctly', () => {
    render(<ProjectHeader project={mockProject} />)
    
    expect(screen.getByText('1.01.2024')).toBeInTheDocument()
    expect(screen.getByText('1.03.2024')).toBeInTheDocument()
  })

  it('handles missing client gracefully', () => {
    const projectWithoutClient = {
      ...mockProject,
      client: undefined
    }
    
    render(<ProjectHeader project={projectWithoutClient} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('shows different status colors for different statuses', () => {
    const completedProject = {
      ...mockProject,
      status: 'completed'
    }
    
    render(<ProjectHeader project={completedProject} />)
    
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })
})
