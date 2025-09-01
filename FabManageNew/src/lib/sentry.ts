export function initSentry() {
    const dsn = import.meta.env.VITE_SENTRY_DSN
    if (!dsn) return
    // Lightweight placeholder to avoid adding heavy SDK by default.
    // If you want full Sentry, install @sentry/react and initialize here.
    console.warn('Sentry DSN provided, but SDK not installed. Install @sentry/react to enable.')
}

