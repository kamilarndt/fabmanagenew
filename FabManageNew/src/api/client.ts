// This file is deprecated - use ../lib/httpClient instead
// Keeping for backwards compatibility during migration

import { api } from '../lib/httpClient'

type FetchOptions = RequestInit & { json?: unknown }

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
    // Migrate to new httpClient
    const method = (opts.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    const data = opts.json || (opts.body ? JSON.parse(opts.body as string) : undefined)

    return api.call<T>(path, {
        method,
        data
    })
}

