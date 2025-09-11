import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../lib/httpClient'

export interface MaterialsFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  supplier?: string
  status?: 'critical' | 'low' | 'normal' | 'excess' | ''
  sortBy?: 'name' | 'price' | 'stock' | 'category'
  sortOrder?: 'asc' | 'desc'
  unit?: string
  thicknessMin?: number
  thicknessMax?: number
  priceMin?: number
  priceMax?: number
}

export interface MaterialItem {
  id: string
  category: string
  type: string
  name: string
  unit: string
  unitCost: number
  format_raw?: string
  pricing_uom?: string
  thickness_mm?: number
  supplier?: string
  quantity: number
  reserved: number
  min_quantity: number
  max_quantity: number
  location?: string
}

export interface MaterialsResponse {
  data: MaterialItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const fetchMaterials = async (filters: MaterialsFilters): Promise<MaterialsResponse> => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, String(value))
    }
  })

  const response = await httpClient.get(`/api/materials?${params.toString()}`)
  return response as MaterialsResponse
}

export const useMaterialsQuery = (filters: MaterialsFilters) => {
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: () => fetchMaterials(filters),
    staleTime: 30000, // 30 sekund cache
    gcTime: 300000, // 5 minut w cache (nowa nazwa dla cacheTime)
  })
}

// Hook do pobierania dostępnych kategorii
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['materials-categories'],
    queryFn: async () => {
      const response = await httpClient.get('/api/materials/categories')
      return response
    },
    staleTime: 300000, // 5 minut - kategorie rzadko się zmieniają
  })
}

// Hook do pobierania dostępnych dostawców
export const useSuppliersQuery = () => {
  return useQuery({
    queryKey: ['materials-suppliers'],
    queryFn: async () => {
      const response = await httpClient.get('/api/materials/suppliers')
      return response
    },
    staleTime: 300000, // 5 minut
  })
}
