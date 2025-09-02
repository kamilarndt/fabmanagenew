export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isProd = import.meta.env.PROD

function log(level: LogLevel, message: string, meta?: unknown) {
    if (isProd && level === 'debug') return
    const payload = meta !== undefined ? [message, meta] : [message]
         
        ; (console as any)[level === 'debug' ? 'log' : level](...payload)
}

export const logger = {
    debug: (msg: string, meta?: unknown) => log('debug', msg, meta),
    info: (msg: string, meta?: unknown) => log('info', msg, meta),
    warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
    error: (msg: string, meta?: unknown) => log('error', msg, meta),
}

