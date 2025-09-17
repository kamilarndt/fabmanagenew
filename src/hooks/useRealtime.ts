// Real-time hooks for Supabase subscriptions
import { useEffect, useRef, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface RealtimeSubscription {
  channel: RealtimeChannel | null
  isConnected: boolean
  error: string | null
}

// Hook for project real-time updates
export const useProjectRealtime = (projectId: string | null) => {
  const [subscription, setSubscription] = useState<RealtimeSubscription>({
    channel: null,
    isConnected: false,
    error: null
  })
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!projectId) return

    // Create channel for project updates
    const channel = supabase
      .channel(`project:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        (payload) => {
          console.log('Project updated:', payload)
          // Trigger custom event for components to listen to
          window.dispatchEvent(new CustomEvent('project-updated', { detail: payload }))
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_messages',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Project message updated:', payload)
          window.dispatchEvent(new CustomEvent('project-message-updated', { detail: payload }))
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_activity',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Project activity updated:', payload)
          window.dispatchEvent(new CustomEvent('project-activity-updated', { detail: payload }))
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bom_items',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('BOM item updated:', payload)
          window.dispatchEvent(new CustomEvent('bom-item-updated', { detail: payload }))
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
        setSubscription(prev => ({
          ...prev,
          isConnected: status === 'SUBSCRIBED',
          error: status === 'CHANNEL_ERROR' ? 'Connection error' : null
        }))
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [projectId])

  return subscription
}

// Hook for general project list updates
export const useProjectsRealtime = () => {
  const [subscription, setSubscription] = useState<RealtimeSubscription>({
    channel: null,
    isConnected: false,
    error: null
  })
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel('projects-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Projects list updated:', payload)
          window.dispatchEvent(new CustomEvent('projects-list-updated', { detail: payload }))
        }
      )
      .subscribe((status) => {
        console.log('Projects realtime subscription status:', status)
        setSubscription(prev => ({
          ...prev,
          isConnected: status === 'SUBSCRIBED',
          error: status === 'CHANNEL_ERROR' ? 'Connection error' : null
        }))
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [])

  return subscription
}

// Hook for materials real-time updates
export const useMaterialsRealtime = () => {
  const [subscription, setSubscription] = useState<RealtimeSubscription>({
    channel: null,
    isConnected: false,
    error: null
  })
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel('materials')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'materials'
        },
        (payload) => {
          console.log('Material updated:', payload)
          window.dispatchEvent(new CustomEvent('material-updated', { detail: payload }))
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suppliers'
        },
        (payload) => {
          console.log('Supplier updated:', payload)
          window.dispatchEvent(new CustomEvent('supplier-updated', { detail: payload }))
        }
      )
      .subscribe((status) => {
        console.log('Materials realtime subscription status:', status)
        setSubscription(prev => ({
          ...prev,
          isConnected: status === 'SUBSCRIBED',
          error: status === 'CHANNEL_ERROR' ? 'Connection error' : null
        }))
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [])

  return subscription
}

// Hook for presence (who's online)
export const usePresence = (projectId: string | null) => {
  const [presence, setPresence] = useState<Record<string, any>>({})
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!projectId) return

    const channel = supabase
      .channel(`presence:${projectId}`, {
        config: {
          presence: {
            key: supabase.auth.getUser().then(({ data: { user } }) => user?.id || 'anonymous')
          }
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        setPresence(newState)
        
        const users = Object.keys(newState)
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            await channel.track({
              user_id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email,
              online_at: new Date().toISOString()
            })
          }
        }
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [projectId])

  return { presence, onlineUsers }
}

// Utility hook to listen to custom real-time events
export const useRealtimeEvent = (eventName: string, callback: (payload: any) => void) => {
  useEffect(() => {
    const handleEvent = (event: CustomEvent) => {
      callback(event.detail)
    }

    window.addEventListener(eventName, handleEvent as EventListener)

    return () => {
      window.removeEventListener(eventName, handleEvent as EventListener)
    }
  }, [eventName, callback])
}
