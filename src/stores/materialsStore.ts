import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Material, BOMItem } from '../types/materials.types';

interface MaterialsState {
  materials: Material[];
  materialsLoading: boolean;
  materialsError: string | null;
  
  bomItems: Record<string, BOMItem[]>;
  
  fetchMaterials: () => Promise<void>;
  addMaterial: (material: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  getBOMTotalCost: (projectId: string) => number;
}

export const useMaterialsStore = create<MaterialsState>()(
  immer((set, get) => ({
    materials: [],
    materialsLoading: false,
    materialsError: null,
    bomItems: {},
    
    fetchMaterials: async () => {
      set((state) => {
        state.materialsLoading = true;
        state.materialsError = null;
      });
      
      try {
        const response = await fetch('/api/materials');
        const materials = await response.json();
        
        set((state) => {
          state.materials = materials;
          state.materialsLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.materialsError = error instanceof Error ? error.message : 'Unknown error';
          state.materialsLoading = false;
        });
      }
    },
    
    addMaterial: async (materialData) => {
      try {
        const response = await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(materialData),
        });
        const material = await response.json();
        
        set((state) => {
          state.materials.push(material);
        });
      } catch (error) {
        throw error;
      }
    },
    
    getBOMTotalCost: (projectId) => {
      const items = get().bomItems[projectId] || [];
      return items.reduce((total, item) => total + item.total_cost, 0);
    },
  }))
);