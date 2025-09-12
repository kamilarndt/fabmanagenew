// Universal Material Management System (UMMS) Store
// Implementacja zgodna z PRD UMMS

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  UniversalMaterial,
  InventoryData,
  MaterialOrder,
  CustomMaterial,
  OrderStatus,
  MaterialFilters,
  MaterialStats,
  MaterialViewConfig,
  ValidationResult
} from '../types/umms.types'

interface UmmsState {
  // Katalog materiałów (wszystkie dostępne materiały - ~200)
  materialCatalog: UniversalMaterial[]

  // Stany magazynowe (tylko materiały na stanie - ~20)
  inventoryData: InventoryData[]

  // Zamówienia materiałów (materiały potrzebne ale niedostępne)
  materialOrders: MaterialOrder[]

  // Materiały niestandardowe
  customMaterials: CustomMaterial[]

  // Konfiguracja widoku
  viewConfig: MaterialViewConfig

  // Actions dla katalogu
  loadMaterialCatalog: () => Promise<void>
  addMaterialToCatalog: (material: Omit<UniversalMaterial, 'id'>) => void
  updateMaterialInCatalog: (id: string, updates: Partial<UniversalMaterial>) => void
  removeMaterialFromCatalog: (id: string) => void

  // Actions dla magazynu
  loadInventoryData: () => Promise<void>
  addMaterialToWarehouse: (materialId: string, initialStock: number, location?: string) => void
  updateMaterialStock: (materialId: string, newStock: number) => void
  adjustMaterialStock: (materialId: string, delta: number, notes?: string) => void
  removeMaterialFromWarehouse: (materialId: string) => void

  // Actions dla zamówień
  loadMaterialOrders: () => Promise<void>
  createMaterialOrder: (order: Omit<MaterialOrder, 'id' | 'requestedAt'>) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  cancelMaterialOrder: (orderId: string) => void

  // Actions dla materiałów niestandardowych
  createCustomMaterial: (material: Omit<CustomMaterial, 'id'>) => void
  updateCustomMaterial: (id: string, updates: Partial<CustomMaterial>) => void

  // Utility functions
  getMaterialById: (id: string) => UniversalMaterial | undefined
  getInventoryByMaterialId: (materialId: string) => InventoryData | undefined
  getMaterialsInStock: () => UniversalMaterial[]
  getMaterialsOutOfStock: () => UniversalMaterial[]
  getMaterialsLowStock: () => UniversalMaterial[]
  validateMaterialThickness: (materialId: string, actualThickness: number) => ValidationResult
  calculateStats: () => MaterialStats

  // Filtering and search
  filterMaterials: (filters: MaterialFilters) => UniversalMaterial[]
  searchMaterials: (query: string) => UniversalMaterial[]

  // View configuration
  updateViewConfig: (config: Partial<MaterialViewConfig>) => void

  // Sync with backend
  syncFromBackend: () => Promise<void>
  syncToBackend: () => Promise<void>
}

export const useUmmsStore = create<UmmsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        materialCatalog: [],
        inventoryData: [],
        materialOrders: [],
        customMaterials: [],
        viewConfig: {
          viewMode: 'warehouse',
          showOnlyInStock: true,
          showStockLevels: true,
          enableQuickOrdering: true,
          defaultFilters: {}
        },

        // Katalog materiałów
        loadMaterialCatalog: async () => {
          try {
            // W rozwoju użyj mock data, w produkcji API
            const { config } = await import('../lib/config')

            if (config.useMockData) {
              const { ummsTestCatalog } = await import('../data/ummsTestCatalog')
              set({ materialCatalog: ummsTestCatalog })
              console.warn(`📋 Loaded ${ummsTestCatalog.length} materials to catalog`)
            } else {
              // TODO: Implement API call
              const response = await fetch('/api/materials/catalog')
              const catalog = await response.json()
              set({ materialCatalog: catalog })
            }
          } catch (error) {
            console.error('Failed to load material catalog:', error)
          }
        },

        addMaterialToCatalog: (material) => {
          const newMaterial: UniversalMaterial = {
            ...material,
            id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
          }
          set(state => ({
            materialCatalog: [...state.materialCatalog, newMaterial]
          }))
        },

        updateMaterialInCatalog: (id, updates) => {
          set(state => ({
            materialCatalog: state.materialCatalog.map(material =>
              material.id === id ? { ...material, ...updates } : material
            )
          }))
        },

        removeMaterialFromCatalog: (id) => {
          set(state => ({
            materialCatalog: state.materialCatalog.filter(material => material.id !== id)
          }))
        },

        // Magazyn
        loadInventoryData: async () => {
          try {
            const { config } = await import('../lib/config')

            if (config.useMockData) {
              const { ummsTestInventory } = await import('../data/ummsTestCatalog')
              set({ inventoryData: ummsTestInventory })
              console.warn(`📦 Loaded ${ummsTestInventory.length} materials to warehouse`)
            } else {
              // TODO: Implement API call
              const response = await fetch('/api/materials/inventory')
              const inventory = await response.json()
              set({ inventoryData: inventory })
            }
          } catch (error) {
            console.error('Failed to load inventory data:', error)
          }
        },

        addMaterialToWarehouse: (materialId, initialStock, location) => {
          const material = get().getMaterialById(materialId)
          if (!material) return

          const newInventory: InventoryData = {
            materialId,
            currentStock: initialStock,
            unit: 'szt', // Default, can be configured
            reservedQuantity: 0,
            availableQuantity: initialStock,
            minStockLevel: Math.max(1, Math.floor(initialStock * 0.2)),
            maxStockLevel: Math.floor(initialStock * 2),
            reorderPoint: Math.max(1, Math.floor(initialStock * 0.3)),
            leadTime: 7, // Default 7 days
            location,
            abcClass: initialStock > 50 ? 'A' : initialStock > 20 ? 'B' : 'C'
          }

          set(state => ({
            inventoryData: [...state.inventoryData, newInventory]
          }))
        },

        updateMaterialStock: (materialId, newStock) => {
          set(state => ({
            inventoryData: state.inventoryData.map(inv =>
              inv.materialId === materialId
                ? {
                  ...inv,
                  currentStock: Math.max(0, newStock),
                  availableQuantity: Math.max(0, newStock - inv.reservedQuantity)
                }
                : inv
            )
          }))
        },

        adjustMaterialStock: (materialId, delta, notes) => {
          const inventory = get().getInventoryByMaterialId(materialId)
          if (inventory) {
            const newStock = Math.max(0, inventory.currentStock + delta)
            get().updateMaterialStock(materialId, newStock)

            // TODO: Add movement record
            console.warn(`Stock adjusted for ${materialId}: ${delta > 0 ? '+' : ''}${delta} (${notes || 'No notes'})`)
          }
        },

        removeMaterialFromWarehouse: (materialId) => {
          set(state => ({
            inventoryData: state.inventoryData.filter(inv => inv.materialId !== materialId)
          }))
        },

        // Zamówienia
        loadMaterialOrders: async () => {
          try {
            const { config } = await import('../lib/config')

            if (config.useMockData) {
              const { ummsTestOrders } = await import('../data/ummsTestCatalog')
              set({ materialOrders: ummsTestOrders })
              console.warn(`📋 Loaded ${ummsTestOrders.length} material orders`)
            } else {
              // TODO: Implement API call
              const response = await fetch('/api/materials/orders')
              const orders = await response.json()
              set({ materialOrders: orders })
            }
          } catch (error) {
            console.error('Failed to load material orders:', error)
          }
        },

        createMaterialOrder: (order) => {
          const newOrder: MaterialOrder = {
            ...order,
            id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            requestedAt: new Date().toISOString()
          }
          set(state => ({
            materialOrders: [...state.materialOrders, newOrder]
          }))
        },

        updateOrderStatus: (orderId, status) => {
          set(state => ({
            materialOrders: state.materialOrders.map(order =>
              order.id === orderId ? { ...order, status } : order
            )
          }))
        },

        cancelMaterialOrder: (orderId) => {
          set(state => ({
            materialOrders: state.materialOrders.filter(order => order.id !== orderId)
          }))
        },

        // Custom materials
        createCustomMaterial: (material) => {
          const newCustomMaterial: CustomMaterial = {
            ...material,
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
          }
          set(state => ({
            customMaterials: [...state.customMaterials, newCustomMaterial]
          }))
        },

        updateCustomMaterial: (id, updates) => {
          set(state => ({
            customMaterials: state.customMaterials.map(material =>
              material.id === id ? { ...material, ...updates } : material
            )
          }))
        },

        // Utility functions
        getMaterialById: (id) => {
          return get().materialCatalog.find(material => material.id === id)
        },

        getInventoryByMaterialId: (materialId) => {
          return get().inventoryData.find(inv => inv.materialId === materialId)
        },

        getMaterialsInStock: () => {
          const { materialCatalog, inventoryData } = get()
          return materialCatalog.filter(material => {
            const inventory = inventoryData.find(inv => inv.materialId === material.id)
            return inventory && inventory.availableQuantity > 0
          })
        },

        getMaterialsOutOfStock: () => {
          const { materialCatalog, inventoryData } = get()
          return materialCatalog.filter(material => {
            const inventory = inventoryData.find(inv => inv.materialId === material.id)
            return !inventory || inventory.availableQuantity === 0
          })
        },

        getMaterialsLowStock: () => {
          const { materialCatalog, inventoryData } = get()
          return materialCatalog.filter(material => {
            const inventory = inventoryData.find(inv => inv.materialId === material.id)
            return inventory && inventory.availableQuantity > 0 && inventory.availableQuantity <= inventory.reorderPoint
          })
        },

        validateMaterialThickness: (materialId, actualThickness) => {
          const material = get().getMaterialById(materialId)
          if (!material) {
            return { status: 'ERROR', message: 'Material not found' }
          }

          const expectedThickness = material.physicalProperties.thickness
          if (!expectedThickness) {
            return { status: 'VALID', message: 'No thickness validation required' }
          }

          const deviation = Math.abs(actualThickness - expectedThickness)
          const rules = material.validationRules

          if (deviation > (rules.errorThreshold || 3.0)) {
            return {
              status: 'ERROR',
              message: `Critical thickness mismatch: ${actualThickness}mm vs expected ${expectedThickness}mm`,
              action: 'BLOCK_PRODUCTION',
              actualThickness,
              expectedThickness,
              deviation
            }
          } else if (deviation > (rules.warningThreshold || 1.0)) {
            return {
              status: 'WARNING',
              message: `Thickness deviation: ${actualThickness}mm (expected ${expectedThickness}mm)`,
              action: 'REQUIRE_CONFIRMATION',
              actualThickness,
              expectedThickness,
              deviation
            }
          }

          return { status: 'VALID' }
        },

        calculateStats: () => {
          const { materialCatalog, inventoryData, materialOrders } = get()

          let totalValue = 0
          let criticalCount = 0
          let lowCount = 0
          let normalCount = 0
          let excessCount = 0

          inventoryData.forEach(inv => {
            const material = materialCatalog.find(m => m.id === inv.materialId)
            if (material) {
              totalValue += material.costData.costPerUnit * inv.currentStock

              if (inv.currentStock <= inv.minStockLevel) {
                criticalCount++
              } else if (inv.currentStock <= inv.reorderPoint) {
                lowCount++
              } else if (inv.currentStock >= inv.maxStockLevel) {
                excessCount++
              } else {
                normalCount++
              }
            }
          })

          return {
            totalCatalogItems: materialCatalog.length,
            warehouseItems: inventoryData.length,
            ordersCount: materialOrders.length,
            totalValue,
            criticalCount,
            lowCount,
            normalCount,
            excessCount
          }
        },

        // Filtering
        filterMaterials: (filters) => {
          const { materialCatalog, inventoryData } = get()

          return materialCatalog.filter(material => {
            // Category filter
            if (filters.category && filters.category.length > 0) {
              if (!filters.category.includes(material.category)) return false
            }

            // Availability filter
            if (filters.availability && filters.availability !== 'ALL') {
              const inventory = inventoryData.find(inv => inv.materialId === material.id)
              const hasStock = inventory && inventory.availableQuantity > 0
              const isLowStock = inventory && inventory.availableQuantity <= inventory.reorderPoint

              switch (filters.availability) {
                case 'IN_STOCK':
                  if (!hasStock) return false
                  break
                case 'LOW_STOCK':
                  if (!isLowStock) return false
                  break
                case 'OUT_OF_STOCK':
                  if (hasStock) return false
                  break
              }
            }

            // Price range filter
            if (filters.priceRange) {
              const price = material.costData.costPerUnit
              if (price < filters.priceRange.min || price > filters.priceRange.max) return false
            }

            // Search filter
            if (filters.search) {
              const query = filters.search.toLowerCase()
              const searchableText = [
                material.universalName,
                material.fabManageCode,
                material.type,
                material.metadata.description || ''
              ].join(' ').toLowerCase()

              if (!searchableText.includes(query)) return false
            }

            return true
          })
        },

        searchMaterials: (query) => {
          return get().filterMaterials({ search: query })
        },

        // View configuration
        updateViewConfig: (config) => {
          set(state => ({
            viewConfig: { ...state.viewConfig, ...config }
          }))
        },

        // Sync functions
        syncFromBackend: async () => {
          await Promise.all([
            get().loadMaterialCatalog(),
            get().loadInventoryData(),
            get().loadMaterialOrders()
          ])
        },

        syncToBackend: async () => {
          // TODO: Implement sync to backend
          console.warn('Syncing to backend...')
        }
      }),
      {
        name: 'umms-store',
        partialize: (state) => ({
          viewConfig: state.viewConfig,
          // Don't persist data, only user preferences
        })
      }
    ),
    { name: 'umms-store' }
  )
)

// Export types for convenience
export type { UniversalMaterial, InventoryData, MaterialOrder, MaterialFilters, MaterialStats }
