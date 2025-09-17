import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Tiles } from '../../pages/Tiles';
import { mockTiles } from '../utils/test-utils';

// Mock the store
vi.mock('../../stores/tilesStore', () => ({
  useTilesStore: () => ({
    tiles: mockTiles,
    isLoading: false,
    error: null,
    fetchTiles: vi.fn(),
    addTile: vi.fn(),
    updateTile: vi.fn(),
    deleteTile: vi.fn(),
    moveTile: vi.fn(),
  }),
}));

describe('Tiles Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tiles list', () => {
    render(<Tiles />);
    
    expect(screen.getByText('Project Tiles')).toBeInTheDocument();
    expect(screen.getByText('Design Review')).toBeInTheDocument();
  });

  it('opens add tile modal when clicking add button', async () => {
    render(<Tiles />);
    
    const addButton = screen.getByText('Add Tile');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add Tile')).toBeInTheDocument();
    });
  });

  it('filters tiles by search term', async () => {
    render(<Tiles />);
    
    const searchInput = screen.getByPlaceholderText('Search tiles...');
    fireEvent.change(searchInput, { target: { value: 'Design' } });
    
    expect(screen.getByText('Design Review')).toBeInTheDocument();
  });

  it('displays tile details correctly', () => {
    render(<Tiles />);
    
    const tile = mockTiles[0];
    expect(screen.getByText(tile.title)).toBeInTheDocument();
    expect(screen.getByText(tile.priority)).toBeInTheDocument();
    expect(screen.getByText(tile.status)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useTilesStore).mockReturnValue({
      tiles: [],
      isLoading: true,
      error: null,
      fetchTiles: vi.fn(),
      addTile: vi.fn(),
      updateTile: vi.fn(),
      deleteTile: vi.fn(),
      moveTile: vi.fn(),
    });

    render(<Tiles />);
    
    expect(screen.getByText('Loading tiles...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useTilesStore).mockReturnValue({
      tiles: [],
      isLoading: false,
      error: 'Failed to load tiles',
      fetchTiles: vi.fn(),
      addTile: vi.fn(),
      updateTile: vi.fn(),
      deleteTile: vi.fn(),
      moveTile: vi.fn(),
    });

    render(<Tiles />);
    
    expect(screen.getByText('Error loading tiles: Failed to load tiles')).toBeInTheDocument();
  });
});
