import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Logistics } from '../../pages/Logistics';

// Mock the store
vi.mock('../../stores/logisticsStore', () => ({
  useLogisticsStore: () => ({
    routes: [],
    vehicles: [],
    drivers: [],
    jobs: [],
    isLoading: false,
    error: null,
    fetchRoutes: vi.fn(),
    fetchVehicles: vi.fn(),
    fetchDrivers: vi.fn(),
    fetchJobs: vi.fn(),
    addRoute: vi.fn(),
    addVehicle: vi.fn(),
    addDriver: vi.fn(),
    addJob: vi.fn(),
    updateRoute: vi.fn(),
    updateVehicle: vi.fn(),
    updateDriver: vi.fn(),
    updateJob: vi.fn(),
    deleteRoute: vi.fn(),
    deleteVehicle: vi.fn(),
    deleteDriver: vi.fn(),
    deleteJob: vi.fn(),
  }),
}));

describe('Logistics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logistics management', () => {
    render(<Logistics />);
    
    expect(screen.getByText('Logistics Management')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useLogisticsStore).mockReturnValue({
      routes: [],
      vehicles: [],
      drivers: [],
      jobs: [],
      isLoading: true,
      error: null,
      fetchRoutes: vi.fn(),
      fetchVehicles: vi.fn(),
      fetchDrivers: vi.fn(),
      fetchJobs: vi.fn(),
      addRoute: vi.fn(),
      addVehicle: vi.fn(),
      addDriver: vi.fn(),
      addJob: vi.fn(),
      updateRoute: vi.fn(),
      updateVehicle: vi.fn(),
      updateDriver: vi.fn(),
      updateJob: vi.fn(),
      deleteRoute: vi.fn(),
      deleteVehicle: vi.fn(),
      deleteDriver: vi.fn(),
      deleteJob: vi.fn(),
    });

    render(<Logistics />);
    
    expect(screen.getByText('Loading logistics data...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useLogisticsStore).mockReturnValue({
      routes: [],
      vehicles: [],
      drivers: [],
      jobs: [],
      isLoading: false,
      error: 'Failed to load logistics data',
      fetchRoutes: vi.fn(),
      fetchVehicles: vi.fn(),
      fetchDrivers: vi.fn(),
      fetchJobs: vi.fn(),
      addRoute: vi.fn(),
      addVehicle: vi.fn(),
      addDriver: vi.fn(),
      addJob: vi.fn(),
      updateRoute: vi.fn(),
      updateVehicle: vi.fn(),
      updateDriver: vi.fn(),
      updateJob: vi.fn(),
      deleteRoute: vi.fn(),
      deleteVehicle: vi.fn(),
      deleteDriver: vi.fn(),
      deleteJob: vi.fn(),
    });

    render(<Logistics />);
    
    expect(screen.getByText('Error loading logistics data: Failed to load logistics data')).toBeInTheDocument();
  });
});
