import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { PricingItem, PricingTemplate, ProjectPricing, PricingCalculation } from '../types/pricing.types';

interface PricingState {
  templates: PricingTemplate[];
  templatesLoading: boolean;
  templatesError: string | null;
  
  projectPricing: Record<string, ProjectPricing>;
  pricingLoading: boolean;
  pricingError: string | null;
  
  // Calculations
  calculations: PricingCalculation[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTemplates: () => Promise<void>;
  addTemplate: (template: Omit<PricingTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<PricingTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  fetchProjectPricing: (projectId: string) => Promise<void>;
  updateProjectPricing: (projectId: string, pricing: Partial<ProjectPricing>) => Promise<void>;
  
  // Calculations
  fetchCalculations: () => Promise<void>;
  calculateProjectPricing: (projectId: string) => Promise<void>;
  exportPricing: (calculationId: string) => Promise<void>;
  calculatePricing: (items: PricingItem[], markupPercentage: number, taxPercentage: number) => PricingCalculation;
  calculateItemTotal: (quantity: number, unitCost: number) => number;
  calculateBreakdown: (items: PricingItem[]) => any;
}

export const usePricingStore = create<PricingState>()(
  immer((set, get) => ({
    templates: [],
    templatesLoading: false,
    templatesError: null,
    
    projectPricing: {},
    pricingLoading: false,
    pricingError: null,
    
    // Calculations
    calculations: [],
    isLoading: false,
    error: null,
    
    fetchTemplates: async () => {
      set((state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      });
      
      try {
        const response = await fetch('/api/pricing/templates');
        const templates = await response.json();
        
        set((state) => {
          state.templates = templates;
          state.templatesLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.templatesError = error instanceof Error ? error.message : 'Unknown error';
          state.templatesLoading = false;
        });
      }
    },
    
    addTemplate: async (templateData) => {
      try {
        const response = await fetch('/api/pricing/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData),
        });
        const template = await response.json();
        
        set((state) => {
          state.templates.push(template);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateTemplate: async (id, updates) => {
      try {
        const response = await fetch(`/api/pricing/templates/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        const template = await response.json();
        
        set((state) => {
          const index = state.templates.findIndex(t => t.id === id);
          if (index !== -1) {
            state.templates[index] = { ...state.templates[index], ...template };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteTemplate: async (id) => {
      try {
        const response = await fetch(`/api/pricing/templates/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete template');
        
        set((state) => {
          state.templates = state.templates.filter(t => t.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    fetchProjectPricing: async (projectId) => {
      set((state) => {
        state.pricingLoading = true;
        state.pricingError = null;
      });
      
      try {
        const response = await fetch(`/api/projects/${projectId}/pricing`);
        const pricing = await response.json();
        
        set((state) => {
          state.projectPricing[projectId] = pricing;
          state.pricingLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.pricingError = error instanceof Error ? error.message : 'Unknown error';
          state.pricingLoading = false;
        });
      }
    },
    
    updateProjectPricing: async (projectId, pricingData) => {
      try {
        const response = await fetch(`/api/projects/${projectId}/pricing`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pricingData),
        });
        const pricing = await response.json();
        
        set((state) => {
          state.projectPricing[projectId] = { ...state.projectPricing[projectId], ...pricing };
        });
      } catch (error) {
        throw error;
      }
    },
    
    calculatePricing: (items, markupPercentage, taxPercentage) => {
      const subtotal = items.reduce((sum, item) => sum + item.total_cost, 0);
      const markupAmount = (subtotal * markupPercentage) / 100;
      const taxableAmount = subtotal + markupAmount;
      const taxAmount = (taxableAmount * taxPercentage) / 100;
      const total = taxableAmount + taxAmount;
      
      const breakdown = get().calculateBreakdown(items);
      
      return {
        items,
        subtotal,
        markup: {
          percentage: markupPercentage,
          amount: markupAmount,
        },
        tax: {
          percentage: taxPercentage,
          amount: taxAmount,
        },
        total,
        breakdown,
      };
    },
    
    calculateItemTotal: (quantity, unitCost) => {
      return quantity * unitCost;
    },
    
    calculateBreakdown: (items) => {
      const breakdown = {
        materials: 0,
        labor: 0,
        equipment: 0,
        overhead: 0,
        transport: 0,
        accommodation: 0,
        total: 0,
      };
      
      items.forEach(item => {
        switch (item.type) {
          case 'material':
            breakdown.materials += item.total_cost;
            break;
          case 'labor':
            breakdown.labor += item.total_cost;
            break;
          case 'equipment':
            breakdown.equipment += item.total_cost;
            break;
          case 'overhead':
            breakdown.overhead += item.total_cost;
            break;
          case 'transport':
            breakdown.transport += item.total_cost;
            break;
          case 'accommodation':
            breakdown.accommodation += item.total_cost;
            break;
        }
        breakdown.total += item.total_cost;
      });
      
      return breakdown;
    },
    
    // New methods for calculations
    fetchCalculations: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        // Mock data for now - replace with actual API call
        const mockCalculations: PricingCalculation[] = [
          {
            id: '1',
            project_id: 'proj-1',
            project_name: 'Sample Project 1',
            description: 'Test project for pricing',
            materials_cost: 1000,
            labor_cost: 2000,
            equipment_cost: 500,
            transport_cost: 300,
            accommodation_cost: 200,
            selling_price: 4500,
            status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            project_id: 'proj-2',
            project_name: 'Sample Project 2',
            description: 'Another test project',
            materials_cost: 1500,
            labor_cost: 3000,
            equipment_cost: 800,
            transport_cost: 400,
            accommodation_cost: 300,
            selling_price: 6500,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        
        set((state) => {
          state.calculations = mockCalculations;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },
    
    calculateProjectPricing: async (projectId) => {
      try {
        // Mock implementation - replace with actual API call
        console.log(`Calculating pricing for project ${projectId}`);
        // In real implementation, this would call the API
      } catch (error) {
        throw error;
      }
    },
    
    exportPricing: async (calculationId) => {
      try {
        // Mock implementation - replace with actual API call
        console.log(`Exporting pricing for calculation ${calculationId}`);
        // In real implementation, this would generate and download a file
      } catch (error) {
        throw error;
      }
    },
  }))
);
