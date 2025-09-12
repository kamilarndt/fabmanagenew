import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && key)

export const supabase = isSupabaseConfigured
    ? createClient(url!, key!)
    : (null as any)

export async function testBackendConnection(): Promise<boolean> {
    if (!isSupabaseConfigured) return false
    try {
        const { error } = await supabase.from('projects').select('id', { count: 'exact', head: true })
        return !error
    } catch {
        return false
    }
}


