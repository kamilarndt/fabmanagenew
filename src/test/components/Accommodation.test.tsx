import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Accommodation } from '../../pages/Accommodation';

// Mock the store
vi.mock('../../stores/accommodationStore', () => ({
  useAccommodationStore: () => ({
    hotels: [],
    rooms: [],
    bookings: [],
    searchResults: [],
    isLoading: false,
    error: null,
    fetchHotels: vi.fn(),
    fetchRooms: vi.fn(),
    fetchBookings: vi.fn(),
    addHotel: vi.fn(),
    addRoom: vi.fn(),
    addBooking: vi.fn(),
    updateHotel: vi.fn(),
    updateRoom: vi.fn(),
    updateBooking: vi.fn(),
    deleteHotel: vi.fn(),
    deleteRoom: vi.fn(),
    deleteBooking: vi.fn(),
    searchHotels: vi.fn(),
    bookHotel: vi.fn(),
    cancelBooking: vi.fn(),
  }),
}));

describe('Accommodation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders accommodation management', () => {
    render(<Accommodation />);
    
    expect(screen.getByText('Accommodation Management')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useAccommodationStore).mockReturnValue({
      hotels: [],
      rooms: [],
      bookings: [],
      searchResults: [],
      isLoading: true,
      error: null,
      fetchHotels: vi.fn(),
      fetchRooms: vi.fn(),
      fetchBookings: vi.fn(),
      addHotel: vi.fn(),
      addRoom: vi.fn(),
      addBooking: vi.fn(),
      updateHotel: vi.fn(),
      updateRoom: vi.fn(),
      updateBooking: vi.fn(),
      deleteHotel: vi.fn(),
      deleteRoom: vi.fn(),
      deleteBooking: vi.fn(),
      searchHotels: vi.fn(),
      bookHotel: vi.fn(),
      cancelBooking: vi.fn(),
    });

    render(<Accommodation />);
    
    expect(screen.getByText('Loading accommodation data...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useAccommodationStore).mockReturnValue({
      hotels: [],
      rooms: [],
      bookings: [],
      searchResults: [],
      isLoading: false,
      error: 'Failed to load accommodation data',
      fetchHotels: vi.fn(),
      fetchRooms: vi.fn(),
      fetchBookings: vi.fn(),
      addHotel: vi.fn(),
      addRoom: vi.fn(),
      addBooking: vi.fn(),
      updateHotel: vi.fn(),
      updateRoom: vi.fn(),
      updateBooking: vi.fn(),
      deleteHotel: vi.fn(),
      deleteRoom: vi.fn(),
      deleteBooking: vi.fn(),
      searchHotels: vi.fn(),
      bookHotel: vi.fn(),
      cancelBooking: vi.fn(),
    });

    render(<Accommodation />);
    
    expect(screen.getByText('Error loading accommodation data: Failed to load accommodation data')).toBeInTheDocument();
  });
});
