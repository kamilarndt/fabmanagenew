/**
 * Safe API client with error handling and mock data fallback
 */

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

interface ApiError {
  message: string;
  status: number;
  response?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Safe fetch wrapper that handles JSON parsing errors
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        errorText
      );
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new ApiError(
        `Expected JSON, got: ${contentType}. Response: ${text.substring(0, 100)}`,
        response.status,
        text
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or other issues
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      0
    );
  }
}

/**
 * Mock data generators for development
 */
export const mockData = {
  logistics: {
    routes: [
      {
        id: '1',
        name: 'Route A',
        start_location: 'Warsaw',
        end_location: 'Krakow',
        distance: 300,
        estimated_time: 4,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Route B',
        start_location: 'Gdansk',
        end_location: 'Wroclaw',
        distance: 400,
        estimated_time: 5,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    vehicles: [
      {
        id: '1',
        license_plate: 'WA12345',
        make: 'Mercedes',
        model: 'Sprinter',
        capacity: 1000,
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    drivers: [
      {
        id: '1',
        name: 'Jan Kowalski',
        license_number: 'DL123456',
        phone: '+48123456789',
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    jobs: [
      {
        id: '1',
        route_id: '1',
        vehicle_id: '1',
        driver_id: '1',
        status: 'scheduled',
        scheduled_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  accommodation: {
    bookings: [
      {
        id: '1',
        project_id: 'proj-1',
        hotel_name: 'Hotel Warsaw',
        check_in: new Date().toISOString(),
        check_out: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        rooms: 2,
        guests: 4,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  files: {
    files: [
      {
        id: '1',
        name: 'project-plan.pdf',
        size: 1024000,
        type: 'application/pdf',
        project_id: 'proj-1',
        uploaded_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  concepts: {
    concepts: [
      {
        id: '1',
        name: 'Modern Design Concept',
        description: 'Contemporary design approach',
        project_id: 'proj-1',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  documents: {
    documents: [
      {
        id: '1',
        title: 'Project Contract',
        type: 'contract',
        project_id: 'proj-1',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  messaging: {
    chatRooms: [
      {
        id: '1',
        name: 'Project Discussion',
        type: 'project',
        project_id: 'proj-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
};

/**
 * Check if we're in development mode and should use mock data
 */
function shouldUseMockData(): boolean {
  return process.env.NODE_ENV === 'development' || 
         process.env.VITE_USE_MOCK_DATA === 'true';
}

/**
 * Get mock data with delay to simulate API call
 */
export async function getMockData<T>(
  data: T,
  delay: number = 500
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Enhanced fetch that falls back to mock data in development
 */
export async function fetchWithMockFallback<T>(
  url: string,
  mockData: T,
  options?: RequestInit
): Promise<T> {
  if (shouldUseMockData()) {
    console.warn(`Using mock data for ${url}`);
    return getMockData(mockData);
  }

  try {
    return await safeFetch<T>(url, options);
  } catch (error) {
    console.warn(`API call failed for ${url}, falling back to mock data:`, error);
    return getMockData(mockData);
  }
}
