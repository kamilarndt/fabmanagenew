export interface Material {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  unit_price: number;
  supplier_id?: string;
  supplier?: {
    id: string;
    name: string;
    contact_email?: string;
    contact_phone?: string;
  };
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface BOMItem {
  id: string;
  project_id: string;
  material_id: string;
  material?: Material;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  website?: string;
  rating?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  material_id: string;
  material?: Material;
  type: "in" | "out" | "adjustment";
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reference?: string;
  notes?: string;
  created_at: string;
  created_by: string;
}
