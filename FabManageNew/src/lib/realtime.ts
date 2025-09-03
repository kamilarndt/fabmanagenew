import { supabase, isSupabaseConfigured } from './supabase'
import { useEffect, useRef } from 'react'
import type { PostgresChangePayload } from '@supabase/supabase-js'

type UpsertFn<T> = (rows: T[]) => void

export function subscribeTable<T>(
    table: string,
    onUpsert: UpsertFn<T>,
    onDelete?: (ids: string[]) => void
) {
    if (!isSupabaseConfigured) return () => { }
    const chan = supabase
        .channel(`${table}-changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, (payload: PostgresChangePayload<any>) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const row = payload.new as T
                onUpsert([row])
            } else if (payload.eventType === 'DELETE') {
                const row = payload.old as any
                onDelete?.([row.id])
            }
        })
        .subscribe()
    return () => { chan.unsubscribe() }
}

export function useRealtimeSubscription<T>(
    table: string,
    onUpsert: UpsertFn<T>,
    onDelete?: (ids: string[]) => void
) {
    const unsubscribeRef = useRef<(() => void) | null>(null)

    useEffect(() => {
        if (isSupabaseConfigured) {
            unsubscribeRef.current = subscribeTable(table, onUpsert, onDelete)
        }

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current()
            }
        }
    }, [table, onUpsert, onDelete])
}


