import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Pricing } from '../../pages/Pricing';
import { mockPricingCalculations } from '../utils/test-utils';

// Mock the store
vi.mock('../../stores/pricingStore', () => ({
  usePricingStore: () => ({
    calculations: mockPricingCalculations,
    isLoading: false,
    error: null,
    fetchCalculations: vi.fn(),
    calculateProjectPricing: vi.fn(),
    exportPricing: vi.fn(),
  }),
}));

describe('Pricing Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pricing list', () => {
    render(<Pricing />);
    
    expect(screen.getByText('Pricing Management')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('displays pricing details correctly', () => {
    render(<Pricing />);
    
    const calculation = mockPricingCalculations[0];
    expect(screen.getByText(calculation.project_name)).toBeInTheDocument();
    expect(screen.getByText(`$${calculation.materials_cost.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`$${calculation.labor_cost.toFixed(2)}`)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(usePricingStore).mockReturnValue({
      calculations: [],
      isLoading: true,
      error: null,
      fetchCalculations: vi.fn(),
      calculateProjectPricing: vi.fn(),
      exportPricing: vi.fn(),
    });

    render(<Pricing />);
    
    expect(screen.getByText('Loading pricing data...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(usePricingStore).mockReturnValue({
      calculations: [],
      isLoading: false,
      error: 'Failed to load pricing data',
      fetchCalculations: vi.fn(),
      calculateProjectPricing: vi.fn(),
      exportPricing: vi.fn(),
    });

    render(<Pricing />);
    
    expect(screen.getByText('Error loading pricing data: Failed to load pricing data')).toBeInTheDocument();
  });
});
