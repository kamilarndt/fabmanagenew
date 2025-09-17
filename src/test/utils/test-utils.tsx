import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { vi } from 'vitest';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const mockMaterials = [
  {
    id: '1',
    code: 'MAT-001',
    name: 'Steel Beam',
    description: 'High-grade steel beam',
    category: 'steel',
    unit: 'pcs',
    unit_price: 150.00,
    supplier_id: 'supplier-1',
    stock_quantity: 100,
    min_stock_level: 10,
    max_stock_level: 200,
    location: 'Warehouse A',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockTiles = [
  {
    id: '1',
    title: 'Design Review',
    description: 'Review the new design concept',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    due_date: '2024-01-15',
    estimated_hours: 8,
    tags: ['design', 'review'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockPricingCalculations = [
  {
    id: '1',
    project_id: 'project-1',
    project_name: 'Test Project',
    description: 'Test pricing calculation',
    materials_cost: 1000,
    labor_cost: 2000,
    equipment_cost: 500,
    transport_cost: 300,
    accommodation_cost: 200,
    selling_price: 4500,
    status: 'approved',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock API responses
export const mockApiResponses = {
  materials: {
    success: {
      data: mockMaterials,
      status: 200,
    },
    error: {
      error: 'Failed to fetch materials',
      status: 500,
    },
  },
  tiles: {
    success: {
      data: mockTiles,
      status: 200,
    },
    error: {
      error: 'Failed to fetch tiles',
      status: 500,
    },
  },
  pricing: {
    success: {
      data: mockPricingCalculations,
      status: 200,
    },
    error: {
      error: 'Failed to fetch pricing',
      status: 500,
    },
  },
};

// Mock fetch function
export const mockFetch = (response: any) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(response),
  });
};

// Mock fetch error
export const mockFetchError = (error: string) => {
  global.fetch = vi.fn().mockRejectedValue(new Error(error));
};

// Mock fetch with status
export const mockFetchWithStatus = (response: any, status: number) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
  });
};

// Test helpers
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: 'project-1',
  name: 'Test Project',
  description: 'Test project description',
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Accessibility testing helpers
export const checkA11y = async (container: HTMLElement) => {
  const { axe, toHaveNoViolations } = await import('jest-axe');
  expect.extend(toHaveNoViolations);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Performance testing helpers
export const measurePerformance = (fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

// Export everything
export * from '@testing-library/react';
export { customRender as render };