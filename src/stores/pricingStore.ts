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
  
  // Actions
  fetchTemplates: () => Promise<void>;
  addTemplate: (template: Omit<PricingTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<PricingTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  fetchProjectPricing: (projectId: string) => Promise<void>;
  updateProjectPricing: (projectId: string, pricing: Partial<ProjectPricing>) => Promise<void>;
  
  // Calculations
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
  }))
);
