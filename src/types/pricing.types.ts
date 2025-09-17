export interface PricingItem {
  id: string;
  name: string;
  type: 'material' | 'labor' | 'equipment' | 'overhead' | 'transport' | 'accommodation';
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
  category?: string;
  supplier?: string;
  notes?: string;
}

export interface PricingTemplate {
  id: string;
  name: string;
  description?: string;
  items: PricingItem[];
  markup_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectPricing {
  id: string;
  project_id: string;
  template_id?: string;
  items: PricingItem[];
  subtotal: number;
  markup_percentage: number;
  markup_amount: number;
  tax_percentage: number;
  tax_amount: number;
  total: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  equipment: number;
  overhead: number;
  transport: number;
  accommodation: number;
  total: number;
}

export interface PricingCalculation {
  items: PricingItem[];
  subtotal: number;
  markup: {
    percentage: number;
    amount: number;
  };
  tax: {
    percentage: number;
    amount: number;
  };
  total: number;
  breakdown: CostBreakdown;
}
