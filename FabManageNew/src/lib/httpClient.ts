import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isSupabaseConfigured, supabase } from './supabase'
import { toBackendTileStatus, toUiTileStatus } from './statusUtils'

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

    // Unified API method that chooses between HTTP and Supabase
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

        try {
            if (useSupabase && table) {
                return await this.supabaseCall<T>(table, { method, data, statusTransform })
            } else {
                return await this.httpCall<T>(endpoint, { method, data, statusTransform })
            }
        } catch (error) {
            // Fallback strategy: if primary method fails, try the other
            console.warn(`Primary API method failed, trying fallback...`)

            if (useSupabase) {
                return await this.httpCall<T>(endpoint, { method, data, statusTransform })
            } else {
                if (table) {
                    return await this.supabaseCall<T>(table, { method, data, statusTransform })
                }
                throw error
            }
        }
    }

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

        // Transform status fields if needed
        if (statusTransform && result) {
            result = this.transformStatus(result, 'toUi') as T
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
