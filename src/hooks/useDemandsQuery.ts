import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../lib/httpClient'

export interface Demand {
    id: string
    materialId: string
    name: string
    requiredQty: number
    createdAt: string
    status: string
    projectId?: string | null
    tileId?: string | null
}

export interface DemandsFilters {
    page?: number
    limit?: number
    search?: string
    status?: string
    projectId?: string
    tileId?: string
    sortBy?: 'createdAt' | 'name' | 'requiredQty' | 'status'
    sortOrder?: 'asc' | 'desc'
}

export interface DemandsResponse {
    data: Demand[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

const fetchDemands = async (filters: DemandsFilters): Promise<DemandsResponse> => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
            params.append(key, String(value))
        }
    })

    const response = await httpClient.get(`/api/demands?${params.toString()}`)
    return response as DemandsResponse
}

export const useDemandsQuery = (filters: DemandsFilters = {}) => {
    return useQuery({
        queryKey: ['demands', filters],
        queryFn: () => fetchDemands(filters),
        staleTime: 30000, // 30 sekund cache
        gcTime: 300000, // 5 minut w cache
    })
}

// Hook do pobierania pojedynczego demand
export const useDemandQuery = (id: string) => {
    return useQuery({
        queryKey: ['demand', id],
        queryFn: async () => {
            const response = await httpClient.get(`/api/demands/${id}`)
            return response as Demand
        },
        enabled: !!id,
        staleTime: 30000,
    })
}

