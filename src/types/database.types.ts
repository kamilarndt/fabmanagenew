// Database types for FabManage-Clean
// Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          company_name: string | null
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          company_name?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company_name?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          client_id: string | null
          status: string
          budget: number | null
          start_date: string | null
          end_date: string | null
          modules: Json
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          client_id?: string | null
          status?: string
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          modules?: Json
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          client_id?: string | null
          status?: string
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          modules?: Json
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      project_messages: {
        Row: {
          id: string
          project_id: string
          author_id: string
          body_html: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          author_id: string
          body_html: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          author_id?: string
          body_html?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_activity: {
        Row: {
          id: string
          project_id: string
          type: string
          payload_json: Json | null
          actor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          payload_json?: Json | null
          actor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          payload_json?: Json | null
          actor_id?: string | null
          created_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          code: string
          name: string
          category: string | null
          unit_price: number | null
          inventory_level: number
          supplier_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          category?: string | null
          unit_price?: number | null
          inventory_level?: number
          supplier_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          category?: string | null
          unit_price?: number | null
          inventory_level?: number
          supplier_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bom_items: {
        Row: {
          id: string
          project_id: string
          material_id: string | null
          quantity: number
          unit_cost: number | null
          total_cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          material_id?: string | null
          quantity: number
          unit_cost?: number | null
          total_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          material_id?: string | null
          quantity?: number
          unit_cost?: number | null
          total_cost?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
