import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

type Role = 'designer' | 'production' | 'warehouse' | 'manager'

interface AuthState {
    user: { id: string; email: string } | null
    roles: Role[]
    loading: boolean
    signIn: (email: string) => Promise<void>
    signOut: () => Promise<void>
    setRoles: (roles: Role[]) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    roles: [],
    loading: false,
    async signIn(email: string) {
        if (!isSupabaseConfigured) { set({ user: { id: 'dev', email }, roles: ['manager'] }); return }
        set({ loading: true })
        try {
            const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
            if (error) throw error
        } finally {
            set({ loading: false })
        }
    },
    async signOut() {
        if (isSupabaseConfigured) await supabase.auth.signOut()
        set({ user: null, roles: [] })
    },
    setRoles(roles) { set({ roles }) }
}))
