/**
 * Environment-aware logger that respects build configuration
 * Replaces console.log statements with proper logging levels
 */

export const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
} as const

export type LogLevel = typeof LogLevel[keyof typeof LogLevel]

interface LoggerConfig {
    level: LogLevel
    enableConsole: boolean
    enableRemote: boolean
    remoteEndpoint?: string
}

class Logger {
    private config: LoggerConfig

    constructor() {
        this.config = this.getConfig()
    }

    private getConfig(): LoggerConfig {
        const isDev = import.meta.env.DEV
        const isProd = import.meta.env.PROD

        return {
            level: isDev ? LogLevel.DEBUG : LogLevel.WARN,
            enableConsole: isDev,
            enableRemote: isProd,
            remoteEndpoint: isProd ? '/api/logs' : undefined
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.config.level
    }

    private formatMessage(level: string, message: string, ...args: unknown[]): string {
        const timestamp = new Date().toISOString()
        const prefix = `[${timestamp}] [${level}]`

        if (args.length === 0) {
            return `${prefix} ${message}`
        }

        return `${prefix} ${message} ${args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')}`
    }

    private log(level: LogLevel, levelName: string, message: string, ...args: unknown[]): void {
        if (!this.shouldLog(level)) {
            return
        }

        const formattedMessage = this.formatMessage(levelName, message, ...args)

        // Console logging (dev only)
        if (this.config.enableConsole) {
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(formattedMessage)
                    break
                case LogLevel.INFO:
                    console.info(formattedMessage)
                    break
                case LogLevel.WARN:
                    console.warn(formattedMessage)
                    break
                case LogLevel.ERROR:
                    console.error(formattedMessage)
                    break
            }
        }

        // Remote logging (prod only)
        if (this.config.enableRemote && this.config.remoteEndpoint) {
            this.sendToRemote(levelName, message, args).catch(() => {
                // Silently fail remote logging to avoid infinite loops
            })
        }
    }

    private async sendToRemote(level: string, message: string, args: unknown[]): Promise<void> {
        try {
            await fetch(this.config.remoteEndpoint!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level,
                    message,
                    args,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            })
        } catch (error) {
            // Silently fail to avoid infinite logging loops
        }
    }

    debug(message: string, ...args: unknown[]): void {
        this.log(LogLevel.DEBUG, 'DEBUG', message, ...args)
    }

    info(message: string, ...args: unknown[]): void {
        this.log(LogLevel.INFO, 'INFO', message, ...args)
    }

    warn(message: string, ...args: unknown[]): void {
        this.log(LogLevel.WARN, 'WARN', message, ...args)
    }

    error(message: string, ...args: unknown[]): void {
        this.log(LogLevel.ERROR, 'ERROR', message, ...args)
    }

    // Convenience methods for common patterns
    apiRequest(method: string, url: string, data?: unknown): void {
        this.debug(`API Request: ${method.toUpperCase()} ${url}`, data)
    }

    apiResponse(status: number, url: string, data?: unknown): void {
        const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG
        const levelName = status >= 400 ? 'ERROR' : 'DEBUG'
        this.log(level, levelName, `API Response: ${status} ${url}`, data)
    }

    componentRender(componentName: string, props?: Record<string, unknown>): void {
        this.debug(`Component Render: ${componentName}`, props)
    }

    userAction(action: string, details?: Record<string, unknown>): void {
        this.info(`User Action: ${action}`, details)
    }

    performance(operation: string, duration: number, details?: Record<string, unknown>): void {
        this.info(`Performance: ${operation} took ${duration}ms`, details)
    }

    // Update config at runtime
    updateConfig(newConfig: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...newConfig }
    }

    // Get current config
    getCurrentConfig(): LoggerConfig {
        return { ...this.config }
    }
}

// Create singleton instance
export const logger = new Logger()

// Convenience exports for common use cases
export const log = {
    debug: (message: string, ...args: unknown[]) => logger.debug(message, ...args),
    info: (message: string, ...args: unknown[]) => logger.info(message, ...args),
    warn: (message: string, ...args: unknown[]) => logger.warn(message, ...args),
    error: (message: string, ...args: unknown[]) => logger.error(message, ...args),
    api: {
        request: (method: string, url: string, data?: unknown) => logger.apiRequest(method, url, data),
        response: (status: number, url: string, data?: unknown) => logger.apiResponse(status, url, data)
    },
    component: (name: string, props?: Record<string, unknown>) => logger.componentRender(name, props),
    user: (action: string, details?: Record<string, unknown>) => logger.userAction(action, details),
    perf: (operation: string, duration: number, details?: Record<string, unknown>) => logger.performance(operation, duration, details)
}

// Development helper to replace console.log statements
export const devLog = import.meta.env.DEV ? console.log : () => { }

// Production-safe console methods
export const safeConsole = {
    log: import.meta.env.DEV ? console.log : () => { },
    warn: console.warn,
    error: console.error,
    info: import.meta.env.DEV ? console.info : () => { },
    debug: import.meta.env.DEV ? console.debug : () => { }
}