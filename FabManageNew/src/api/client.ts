type FetchOptions = RequestInit & { json?: unknown }

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
    const base = import.meta.env.VITE_API_BASE_URL || ''
    const headers = new Headers(opts.headers)
    headers.set('Content-Type', 'application/json')
    const res = await fetch(`${base}${path}`, {
        ...opts,
        headers,
        body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status}: ${text}`)
    }
    if (res.status === 204) return undefined as T
    return await res.json() as T
}

