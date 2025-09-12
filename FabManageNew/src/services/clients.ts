// Create simple clients service
export type Client = {
    id: string
    name: string
    email?: string
    phone?: string
    tax_id?: string
    created_at?: string
}

import { api } from '../lib/httpClient'

export async function listClients(): Promise<Client[]> {
    return api.call<Client[]>('/api/clients', { method: 'GET', table: 'clients', useSupabase: false })
}

export async function createClient(payload: { name: string; email?: string; phone?: string; tax_id?: string }): Promise<Client> {
    return api.call<Client>('/api/clients', { method: 'POST', data: payload, table: 'clients', useSupabase: false })
}
