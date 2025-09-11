import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isSupabaseConfigured, supabase } from './supabase'
import { toBackendTileStatus, toUiTileStatus } from './statusUtils'
import { connectionMonitor } from './connectionMonitor'

// Types
export interface ApiResponse<T = any> {
    data: T
    status: number
    message?: string
}

export interface HttpClientOptions {
    baseURL?: string
    timeout?: number
    headers?: Record<string, string>
}

// Error types
export class ApiError extends Error {
    public status: number
    public response?: any

    constructor(message: string, status: number, response?: any) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.response = response
    }
}

class HttpClient {
    private axiosInstance: AxiosInstance
    private supabaseClient = supabase

    constructor(options: HttpClientOptions = {}) {
        const baseURL = options.baseURL || import.meta.env.VITE_API_BASE_URL || ''

        this.axiosInstance = axios.create({
            baseURL,
            timeout: options.timeout || 10000,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Add auth token if available
                const token = this.getAuthToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }

                console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`)
                return config
            },
            (error) => {
                console.error('❌ Request Error:', error)
                return Promise.reject(error)
            }
        )

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`✅ API Response: ${response.status} ${response.config.url}`)
                return response
            },
            (error) => {
                const status = error.response?.status || 0
                const message = error.response?.data?.message || error.message

                console.error(`❌ API Error: ${status} ${error.config?.url} - ${message}`)

                // Transform to our custom error
                throw new ApiError(message, status, error.response?.data)
            }
        )
    }

    private getAuthToken(): string | null {
        // Try to get from localStorage, sessionStorage, or Supabase
        try {
            return localStorage.getItem('authToken') ||
                sessionStorage.getItem('authToken') ||
                null
        } catch {
            return null
        }
    }

    // Generic HTTP methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config)
        return response.data
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config)
        return response.data
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config)
        return response.data
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config)
        return response.data
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config)
        return response.data
    }

    // Unified API method that chooses between HTTP and Supabase with connection monitoring
    async apiCall<T>(endpoint: string, options: {
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
        data?: any
        table?: string
        useSupabase?: boolean
        statusTransform?: boolean
    } = {}): Promise<T> {
        const {
            method = 'GET',
            data,
            table,
            useSupabase = isSupabaseConfigured,
            statusTransform = false
        } = options

        // Check connection status first
        const connectionStatus = connectionMonitor.getStatus()

        try {
            // If database is available, use it
            if (connectionStatus.isConnected && connectionStatus.source === 'database') {
                if (useSupabase && table) {
                    return await this.supabaseCall<T>(table, { method, data, statusTransform })
                } else {
                    return await this.httpCall<T>(endpoint, { method, data, statusTransform })
                }
            } else {
                // Database not available, use fallback strategy
                console.warn('📱 Database unavailable, using fallback data strategy:', connectionStatus.source)
                return await this.getFallbackData<T>(endpoint, method, data)
            }
        } catch (error) {
            // Primary method failed, try fallback
            console.warn(`Primary API method failed, trying fallback...`)

            // Update connection status as failed
            connectionMonitor.updateConnectionStatus()

            return await this.getFallbackData<T>(endpoint, method, data)
        }
    }

    /**
     * Fallback data strategy when database is unavailable
     */
    private async getFallbackData<T>(endpoint: string, method: string, data?: any): Promise<T> {
        const strategy = connectionMonitor.getApiStrategy()

        if (strategy === 'mock') {
            return await this.getMockData<T>(endpoint)
        } else {
            // Try localStorage cache or return empty data
            return await this.getLocalStorageData<T>(endpoint, method, data)
        }
    }

    /**
     * Get mock data for development
     */
    private async getMockData<T>(endpoint: string): Promise<T> {
        try {
            // Import mock data dynamically
            if (endpoint.includes('/api/projects')) {
                const { mockProjects } = await import('../data/development')
                return mockProjects as T
            } else if (endpoint.includes('/api/clients')) {
                const { mockClients } = await import('../data/development')
                return mockClients as T
            } else if (endpoint.includes('/api/tiles')) {
                console.log('🔧 httpClient: Loading mock tiles data...')
                const { mockTiles } = await import('../data/development')
                console.log('🔧 httpClient: Loaded mock tiles:', { count: mockTiles.length, first: mockTiles[0] })
                return mockTiles as T
            } else if (endpoint.includes('/api/materials')) {
                const { mockMaterials } = await import('../data/development')
                return mockMaterials as T
            }

            // Default empty response
            return [] as T
        } catch (error) {
            console.warn('Failed to load mock data:', error)
            return [] as T
        }
    }

    /**
     * Get data from localStorage cache
     */
    private async getLocalStorageData<T>(endpoint: string, method: string, _data?: any): Promise<T> {
        try {
            if (method === 'GET') {
                const cacheKey = `fabmanage_cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`
                const cached = localStorage.getItem(cacheKey)

                if (cached) {
                    console.log('📂 Using cached data for:', endpoint)
                    return JSON.parse(cached) as T
                }
            }

            // For write operations or no cache, return empty/default response
            if (method === 'POST' && _data) {
                return { ..._data, id: Date.now().toString() } as T
            }

            return [] as T
        } catch (error) {
            console.warn('Failed to load cached data:', error)
            return [] as T
        }
    }

    /**
     * Cache successful responses in localStorage
     */
    private cacheResponse(endpoint: string, data: any) {
        try {
            const cacheKey = `fabmanage_cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`
            localStorage.setItem(cacheKey, JSON.stringify(data))
            localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
        } catch (error) {
            console.warn('Failed to cache response:', error)
        }
    }

    // Update existing httpCall to cache responses
    private async httpCall<T>(endpoint: string, options: {
        method: string
        data?: any
        statusTransform?: boolean
    }): Promise<T> {
        const { method, data, statusTransform } = options

        let result: T

        switch (method) {
            case 'GET':
                result = await this.get<T>(endpoint)
                break
            case 'POST':
                result = await this.post<T>(endpoint, data)
                break
            case 'PUT':
                result = await this.put<T>(endpoint, data)
                break
            case 'PATCH':
                result = await this.patch<T>(endpoint, data)
                break
            case 'DELETE':
                result = await this.delete<T>(endpoint)
                break
            default:
                throw new Error(`Unsupported HTTP method: ${method}`)
        }

        // Cache GET responses for fallback
        if (method === 'GET' && result) {
            this.cacheResponse(endpoint, result)
        }

        // Transform status fields if needed
        if (statusTransform && result) {
            if (Array.isArray(result)) {
                return (result as any[]).map(item => this.transformStatus(item, 'toUi')) as T
            } else {
                return this.transformStatus(result, 'toUi') as T
            }
        }

        return result
    }


    private async supabaseCall<T>(table: string, options: {
        method: string
        data?: any
        statusTransform?: boolean
    }): Promise<T> {
        const { method, data, statusTransform } = options

        const query = this.supabaseClient.from(table)
        let result: any

        switch (method) {
            case 'GET': {
                const { data: selectData, error: selectError } = await query.select('*')
                if (selectError) throw selectError
                result = selectData
                break
            }

            case 'POST': {
                const transformedData = statusTransform ? this.transformStatus(data, 'toBackend') : data
                const { data: insertData, error: insertError } = await query.insert(transformedData).select().single()
                if (insertError) throw insertError
                result = insertData
                break
            }

            case 'PUT':
            case 'PATCH': {
                const transformedPatch = statusTransform ? this.transformStatus(data, 'toBackend') : data
                const { error: updateError } = await query.update(transformedPatch).eq('id', data.id)
                if (updateError) throw updateError
                result = null
                break
            }

            case 'DELETE': {
                const { error: deleteError } = await query.delete().eq('id', data.id)
                if (deleteError) throw deleteError
                result = null
                break
            }

            default:
                throw new Error(`Unsupported method for Supabase: ${method}`)
        }

        // Transform status fields if needed
        if (statusTransform && result) {
            result = this.transformStatus(result, 'toUi')
        }

        return result as T
    }

    private transformStatus(data: any, direction: 'toUi' | 'toBackend'): any {
        if (!data) return data

        if (Array.isArray(data)) {
            return data.map(item => this.transformStatus(item, direction))
        }

        if (typeof data === 'object' && data.status) {
            return {
                ...data,
                status: direction === 'toUi'
                    ? toUiTileStatus(data.status)
                    : toBackendTileStatus(data.status)
            }
        }

        return data
    }

    // Utility methods
    setAuthToken(token: string) {
        try {
            localStorage.setItem('authToken', token)
        } catch {
            console.warn('Failed to store auth token')
        }
    }

    clearAuthToken() {
        try {
            localStorage.removeItem('authToken')
            sessionStorage.removeItem('authToken')
        } catch {
            console.warn('Failed to clear auth token')
        }
    }

    // Get current configuration
    getConfig() {
        return {
            baseURL: this.axiosInstance.defaults.baseURL,
            timeout: this.axiosInstance.defaults.timeout,
            isSupabaseConfigured
        }
    }
}

// Create singleton instance
export const httpClient = new HttpClient()

// Export for custom instances
export { HttpClient }

// Convenience exports
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig) => httpClient.get<T>(url, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => httpClient.post<T>(url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => httpClient.put<T>(url, data, config),
    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => httpClient.patch<T>(url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) => httpClient.delete<T>(url, config),
    call: <T>(endpoint: string, options?: Parameters<HttpClient['apiCall']>[1]) => httpClient.apiCall<T>(endpoint, options)
}

export async function callEdgeFunction<T = any>(fnName: string, payload?: any): Promise<T> {
    if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured')
    }
    try {
        const { data, error } = await supabase.functions.invoke(fnName, {
            body: payload || {},
        } as any)
        if (error) throw error
        return data as T
    } catch (err: any) {
        throw new ApiError(err?.message || 'Edge function call failed', err?.status || 500, err)
    }
}
