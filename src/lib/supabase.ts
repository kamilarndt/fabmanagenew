// Supabase client configuration for FabManage-Clean
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create Supabase client only if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    return await supabase.auth.signUp({ email, password });
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    if (!supabase) throw new Error("Supabase not configured");
    return await supabase.auth.signOut();
  },

  getCurrentUser: () => {
    if (!supabase) throw new Error("Supabase not configured");
    return supabase.auth.getUser();
  },
};

export default supabase;
