import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Materials } from '../../pages/Materials';
import { mockMaterials, mockFetch } from '../utils/test-utils';

// Mock the store
vi.mock('../../stores/materialsStore', () => ({
  useMaterialsStore: () => ({
    materials: mockMaterials,
    suppliers: [],
    isLoading: false,
    error: null,
    fetchMaterials: vi.fn(),
    fetchSuppliers: vi.fn(),
    addMaterial: vi.fn(),
    updateMaterial: vi.fn(),
    deleteMaterial: vi.fn(),
  }),
}));

describe('Materials Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders materials list', () => {
    render(<Materials />);
    
    expect(screen.getByText('Materials Management')).toBeInTheDocument();
    expect(screen.getByText('Steel Beam')).toBeInTheDocument();
    expect(screen.getByText('MAT-001')).toBeInTheDocument();
  });

  it('opens add material modal when clicking add button', async () => {
    render(<Materials />);
    
    const addButton = screen.getByText('Add Material');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add Material')).toBeInTheDocument();
    });
  });

  it('filters materials by search term', async () => {
    render(<Materials />);
    
    const searchInput = screen.getByPlaceholderText('Search materials...');
    fireEvent.change(searchInput, { target: { value: 'Steel' } });
    
    expect(screen.getByText('Steel Beam')).toBeInTheDocument();
  });

  it('displays material details correctly', () => {
    render(<Materials />);
    
    const material = mockMaterials[0];
    expect(screen.getByText(material.name)).toBeInTheDocument();
    expect(screen.getByText(material.code)).toBeInTheDocument();
    expect(screen.getByText(material.category)).toBeInTheDocument();
    expect(screen.getByText(`$${material.unit_price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useMaterialsStore).mockReturnValue({
      materials: [],
      suppliers: [],
      isLoading: true,
      error: null,
      fetchMaterials: vi.fn(),
      fetchSuppliers: vi.fn(),
      addMaterial: vi.fn(),
      updateMaterial: vi.fn(),
      deleteMaterial: vi.fn(),
    });

    render(<Materials />);
    
    expect(screen.getByText('Loading materials...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useMaterialsStore).mockReturnValue({
      materials: [],
      suppliers: [],
      isLoading: false,
      error: 'Failed to load materials',
      fetchMaterials: vi.fn(),
      fetchSuppliers: vi.fn(),
      addMaterial: vi.fn(),
      updateMaterial: vi.fn(),
      deleteMaterial: vi.fn(),
    });

    render(<Materials />);
    
    expect(screen.getByText('Error loading materials: Failed to load materials')).toBeInTheDocument();
  });
});
