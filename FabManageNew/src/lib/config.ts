/**
 * Configuration management for FabManage application
 */

export type Environment = 'development' | 'production' | 'test'

export interface AppConfig {
    environment: Environment
    apiBaseUrl: string
    useMockData: boolean
    enableRealtimeUpdates: boolean
    logLevel: 'debug' | 'info' | 'warn' | 'error'
    supabaseUrl?: string
    supabaseKey?: string
}

function getEnvironment(): Environment {
    const env = import.meta.env.NODE_ENV
    if (env === 'production') return 'production'
    if (env === 'test') return 'test'
    return 'development'
}

function shouldUseMockData(): boolean {
    // Use mock data only when explicitly enabled
    const forceMock = import.meta.env.VITE_USE_MOCK_DATA === 'true'
    const noApiUrl = !import.meta.env.VITE_API_BASE_URL && getEnvironment() !== 'development'

    // Only use mock data if explicitly requested or no API URL (except in development)
    return forceMock || noApiUrl
}

export const config: AppConfig = {
    environment: getEnvironment(),
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || (getEnvironment() === 'development' ? '/api' : 'http://localhost:3001/api'),
    useMockData: shouldUseMockData(),
    enableRealtimeUpdates: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
    logLevel: import.meta.env.VITE_LOG_LEVEL || (getEnvironment() === 'development' ? 'debug' : 'info'),
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY
}

// Environment checks
export const isDevelopment = config.environment === 'development'
export const isProduction = config.environment === 'production'
export const isTest = config.environment === 'test'

// Feature flags
export const features = {
    mockData: config.useMockData,
    realtimeUpdates: config.enableRealtimeUpdates && isProduction,
    debugLogs: isDevelopment || config.logLevel === 'debug',
    errorReporting: isProduction,
    offlineSupport: true
} as const

console.log('🔧 App Config:', {
    environment: config.environment,
    useMockData: config.useMockData,
    features: Object.entries(features)
        .filter(([, enabled]) => enabled)
        .map(([feature]) => feature)
})

export default config
