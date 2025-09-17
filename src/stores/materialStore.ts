// Zustand store for material management
import { useEffect } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export interface Material {
  id: string;
  code: string;
  name: string;
  category: string | null;
  unit_price: number | null;
  inventory_level: number;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
  supplier?: {
    id: string;
    name: string;
  };
}

export interface BOMItem {
  id: string;
  project_id: string;
  material_id: string | null;
  quantity: number;
  unit_cost: number | null;
  total_cost: number | null;
  created_at: string;
  updated_at: string;
  material?: Material;
}

export interface Supplier {
  id: string;
  name: string;
  contact_info: any;
  created_at: string;
  updated_at: string;
}

interface MaterialState {
  // State
  materials: Material[];
  suppliers: Supplier[];
  bomItems: Record<string, BOMItem[]>; // projectId -> BOM items
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMaterials: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  createMaterial: (
    material: Omit<Material, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;

  // Suppliers
  createSupplier: (
    supplier: Omit<Supplier, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // BOM Items
  fetchBOMItems: (projectId: string) => Promise<void>;
  addBOMItem: (
    projectId: string,
    bomItem: Omit<BOMItem, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateBOMItem: (id: string, updates: Partial<BOMItem>) => Promise<void>;
  deleteBOMItem: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useMaterialStore = create<MaterialState>()(
  devtools(
    (set) => ({
      // Initial state
      materials: [],
      suppliers: [],
      bomItems: {},
      isLoading: false,
      error: null,

      // Fetch all materials
      fetchMaterials: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("materials")
            .select(
              `
              *,
              suppliers (
                id,
                name
              )
            `
            )
            .order("name");

          if (error) throw error;
          set({ materials: data || [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Fetch all suppliers
      fetchSuppliers: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("suppliers")
            .select("*")
            .order("name");

          if (error) throw error;
          set({ suppliers: data || [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Create new material
      createMaterial: async (materialData) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("materials")
            .insert(materialData)
            .select(
              `
              *,
              suppliers (
                id,
                name
              )
            `
            )
            .single();

          if (error) throw error;

          set((state) => ({
            materials: [...state.materials, data],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Update material
      updateMaterial: async (id: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("materials")
            .update(updates)
            .eq("id", id)
            .select(
              `
              *,
              suppliers (
                id,
                name
              )
            `
            )
            .single();

          if (error) throw error;

          set((state) => ({
            materials: state.materials.map((m) => (m.id === id ? data : m)),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Delete material
      deleteMaterial: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("materials")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set((state) => ({
            materials: state.materials.filter((m) => m.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Create new supplier
      createSupplier: async (supplierData) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("suppliers")
            .insert(supplierData)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            suppliers: [...state.suppliers, data],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Update supplier
      updateSupplier: async (id: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("suppliers")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            suppliers: state.suppliers.map((s) => (s.id === id ? data : s)),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Delete supplier
      deleteSupplier: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("suppliers")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set((state) => ({
            suppliers: state.suppliers.filter((s) => s.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Fetch BOM items for project
      fetchBOMItems: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("bom_items")
            .select(
              `
              *,
              materials (
                id,
                code,
                name,
                category,
                unit_price,
                suppliers (
                  id,
                  name
                )
              )
            `
            )
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

          if (error) throw error;

          set((state) => ({
            bomItems: {
              ...state.bomItems,
              [projectId]: data || [],
            },
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Add BOM item
      addBOMItem: async (projectId: string, bomItemData) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("bom_items")
            .insert({
              ...bomItemData,
              project_id: projectId,
            })
            .select(
              `
              *,
              materials (
                id,
                code,
                name,
                category,
                unit_price,
                suppliers (
                  id,
                  name
                )
              )
            `
            )
            .single();

          if (error) throw error;

          set((state) => ({
            bomItems: {
              ...state.bomItems,
              [projectId]: [data, ...(state.bomItems[projectId] || [])],
            },
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Update BOM item
      updateBOMItem: async (id: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("bom_items")
            .update(updates)
            .eq("id", id)
            .select(
              `
              *,
              materials (
                id,
                code,
                name,
                category,
                unit_price,
                suppliers (
                  id,
                  name
                )
              )
            `
            )
            .single();

          if (error) throw error;

          // Update in all project BOM lists
          set((state) => {
            const newBomItems = { ...state.bomItems };
            Object.keys(newBomItems).forEach((projectId) => {
              newBomItems[projectId] = newBomItems[projectId].map((item) =>
                item.id === id ? data : item
              );
            });

            return {
              bomItems: newBomItems,
              isLoading: false,
            };
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Delete BOM item
      deleteBOMItem: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("bom_items")
            .delete()
            .eq("id", id);

          if (error) throw error;

          // Remove from all project BOM lists
          set((state) => {
            const newBomItems = { ...state.bomItems };
            Object.keys(newBomItems).forEach((projectId) => {
              newBomItems[projectId] = newBomItems[projectId].filter(
                (item) => item.id !== id
              );
            });

            return {
              bomItems: newBomItems,
              isLoading: false,
            };
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "material-store",
    }
  )
);

// Real-time integration for material store
export const useMaterialRealtime = () => {
  const { fetchMaterials, fetchBOMItems } = useMaterialStore();

  useEffect(() => {
    const handleMaterialUpdate = (payload: any) => {
      console.log("Real-time material update:", payload);
      fetchMaterials();
    };

    const handleSupplierUpdate = (payload: any) => {
      console.log("Real-time supplier update:", payload);
      fetchMaterials();
    };

    // Listen to real-time events
    window.addEventListener("material-updated", handleMaterialUpdate);
    window.addEventListener("supplier-updated", handleSupplierUpdate);

    return () => {
      window.removeEventListener("material-updated", handleMaterialUpdate);
      window.removeEventListener("supplier-updated", handleSupplierUpdate);
    };
  }, [fetchMaterials, fetchBOMItems]);
};
