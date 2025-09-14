export interface Material {
  id: string;
  name: string;
  category: string;
  supplier?: string;
  unit: "pcs" | "m" | "m2" | "m3" | "kg" | "l";
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: MaterialCategory[];
}

export interface MaterialStock {
  materialId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lastUpdated: string;
}

export interface MaterialFilters {
  category?: string[];
  supplier?: string[];
  stockLevel?: "low" | "normal" | "high" | "out";
  search?: string;
  isActive?: boolean;
}

export interface MaterialStats {
  totalMaterials: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  categories: number;
}
