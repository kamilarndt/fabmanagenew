// Supabase Edge Function: Calculate Project Pricing
// Automatycznie przelicza koszty projektu na podstawie BOM, logistyki i zakwaterowania

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PricingCalculation {
  project_id: string
  material_cost: number
  logistics_cost: number
  accommodation_cost: number
  markup_percentage: number
  markup_amount: number
  total_cost: number
  cost_breakdown: Array<{
    category: string
    amount: number
    details: any
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { project_id, markup_percentage = 15 } = await req.json()

    if (!project_id) {
      throw new Error('project_id is required')
    }

    // Get project details
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('id, name, budget')
      .eq('id', project_id)
      .single()

    if (projectError) {
      throw new Error(`Failed to fetch project: ${projectError.message}`)
    }

    // Calculate material costs from BOM
    const { data: bomItems, error: bomError } = await supabaseClient
      .from('bom_items')
      .select(`
        id,
        quantity,
        unit_cost,
        total_cost,
        materials (
          code,
          name,
          category
        )
      `)
      .eq('project_id', project_id)

    if (bomError) {
      throw new Error(`Failed to fetch BOM items: ${bomError.message}`)
    }

    const material_cost = bomItems?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0

    // Calculate logistics costs
    const { data: logisticsOrders, error: logisticsError } = await supabaseClient
      .from('logistics_orders')
      .select('total_cost')
      .eq('project_id', project_id)

    if (logisticsError) {
      throw new Error(`Failed to fetch logistics orders: ${logisticsError.message}`)
    }

    const logistics_cost = logisticsOrders?.reduce((sum, order) => sum + (order.total_cost || 0), 0) || 0

    // Calculate accommodation costs
    const { data: accommodationBookings, error: accommodationError } = await supabaseClient
      .from('accommodation_bookings')
      .select('total_cost')
      .eq('project_id', project_id)

    if (accommodationError) {
      throw new Error(`Failed to fetch accommodation bookings: ${accommodationError.message}`)
    }

    const accommodation_cost = accommodationBookings?.reduce((sum, booking) => sum + (booking.total_cost || 0), 0) || 0

    // Calculate total costs before markup
    const subtotal = material_cost + logistics_cost + accommodation_cost
    const markup_amount = (subtotal * markup_percentage) / 100
    const total_cost = subtotal + markup_amount

    // Create cost breakdown
    const cost_breakdown = [
      {
        category: 'materials',
        amount: material_cost,
        details: {
          bom_items_count: bomItems?.length || 0,
          items: bomItems?.map(item => ({
            material_code: item.materials?.code,
            material_name: item.materials?.name,
            quantity: item.quantity,
            unit_cost: item.unit_cost,
            total_cost: item.total_cost
          }))
        }
      },
      {
        category: 'logistics',
        amount: logistics_cost,
        details: {
          orders_count: logisticsOrders?.length || 0
        }
      },
      {
        category: 'accommodation',
        amount: accommodation_cost,
        details: {
          bookings_count: accommodationBookings?.length || 0
        }
      },
      {
        category: 'markup',
        amount: markup_amount,
        details: {
          percentage: markup_percentage
        }
      }
    ]

    const pricing: PricingCalculation = {
      project_id,
      material_cost,
      logistics_cost,
      accommodation_cost,
      markup_percentage,
      markup_amount,
      total_cost,
      cost_breakdown
    }

    // Upsert pricing data
    const { error: upsertError } = await supabaseClient
      .from('project_pricing')
      .upsert({
        project_id,
        total_cost,
        material_cost,
        logistics_cost,
        accommodation_cost,
        markup_percentage,
        markup_amount,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      throw new Error(`Failed to save pricing: ${upsertError.message}`)
    }

    // Clear and insert cost breakdown
    await supabaseClient
      .from('pricing_breakdown')
      .delete()
      .eq('project_id', project_id)

    if (cost_breakdown.length > 0) {
      const { error: breakdownError } = await supabaseClient
        .from('pricing_breakdown')
        .insert(
          cost_breakdown.map(item => ({
            project_id,
            category: item.category,
            amount: item.amount,
            details: item.details
          }))
        )

      if (breakdownError) {
        throw new Error(`Failed to save cost breakdown: ${breakdownError.message}`)
      }
    }

    // Log activity
    await supabaseClient
      .from('project_activity')
      .insert({
        project_id,
        type: 'pricing_calculated',
        payload_json: {
          total_cost,
          material_cost,
          logistics_cost,
          accommodation_cost,
          markup_percentage,
          markup_amount
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        data: pricing,
        message: 'Pricing calculated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error calculating pricing:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to calculate pricing'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
