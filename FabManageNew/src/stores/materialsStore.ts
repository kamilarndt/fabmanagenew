import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { subscribeTable } from '../lib/realtime'
import type { MaterialData } from '../data/materialsMockData'
import { fetchBackendFlatMaterials } from '../api/materials'

export interface PurchaseRequest {
  id: string
  projectId: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  requestedBy: string
  requestedAt: number
  status: 'pending' | 'approved' | 'rejected' | 'ordered'
  priority: 'low' | 'medium' | 'high'
  notes?: string
}

export interface SupplierQuote {
  id: string
  purchaseRequestId: string
  supplierName: string
  price: number
  currency: string
  deliveryTime: number // days
  validUntil: number
  notes?: string
}

export interface StockReservation {
  id: string
  projectId: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  reservedAt: number
  reservedBy: string
  status: 'reserved' | 'released' | 'consumed'
}

export interface DeliveryTracking {
  id: string
  projectId: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  supplierName: string
  expectedDelivery: number
  actualDelivery?: number
  status: 'ordered' | 'in_transit' | 'delivered' | 'delayed'
  trackingNumber?: string
  notes?: string
}

interface MaterialsStore {
  // Inventory
  materials: MaterialData[]
  setMaterials: (materials: MaterialData[]) => void
  updateMaterialStock: (id: string, stock: number) => void
  adjustMaterialStock: (id: string, delta: number) => void
  syncFromBackend: () => Promise<void>

  purchaseRequests: PurchaseRequest[]
  supplierQuotes: SupplierQuote[]
  stockReservations: StockReservation[]
  deliveryTracking: DeliveryTracking[]

  // Purchase Requests
  addPurchaseRequest: (request: Omit<PurchaseRequest, 'id' | 'requestedAt'>) => void
  updatePurchaseRequest: (id: string, updates: Partial<PurchaseRequest>) => void
  removePurchaseRequest: (id: string) => void
  getPurchaseRequestsByProject: (projectId: string) => PurchaseRequest[]

  // Supplier Quotes
  addSupplierQuote: (quote: Omit<SupplierQuote, 'id'>) => void
  updateSupplierQuote: (id: string, updates: Partial<SupplierQuote>) => void
  removeSupplierQuote: (id: string) => void
  getQuotesByRequest: (purchaseRequestId: string) => SupplierQuote[]

  // Stock Reservations
  addStockReservation: (reservation: Omit<StockReservation, 'id' | 'reservedAt'>) => void
  updateStockReservation: (id: string, updates: Partial<StockReservation>) => void
  removeStockReservation: (id: string) => void
  getReservationsByProject: (projectId: string) => StockReservation[]

  // Delivery Tracking
  addDeliveryTracking: (delivery: Omit<DeliveryTracking, 'id'>) => void
  updateDeliveryTracking: (id: string, updates: Partial<DeliveryTracking>) => void
  removeDeliveryTracking: (id: string) => void
  getDeliveriesByProject: (projectId: string) => DeliveryTracking[]
}

export const useMaterialsStore = create<MaterialsStore>()(
  persist(
    (set, get) => ({
      // Inventory seeded from mock for now; replace with API fetch when available
      materials: [],
      setMaterials: (materials) => set({ materials }),
      updateMaterialStock: (id, stock) => set((state) => ({
        materials: state.materials.map(m => m.id === id ? { ...m, stock } : m)
      })),
      adjustMaterialStock: (id, delta) => set((state) => ({
        materials: state.materials.map(m => m.id === id ? { ...m, stock: Math.max(0, m.stock + delta) } : m)
      })),

      // Sync from backend /api/materials/flat, mapping by canonical ID
      syncFromBackend: async () => {
        try {
          // Try to ensure backend has materials hydrated
          try { await import('../api/materials').then(m => m.reloadMaterials?.()); } catch { /* Ignore import errors */ }

          const flat = await fetchBackendFlatMaterials()
          set((state) => {
            const index = new Map(state.materials.map(m => [m.id, m]))
            const updatedMaterials = [...state.materials]

            for (const fm of flat) {
              const m = index.get(fm.id)
              if (m) {
                // Aktualizuj istniejący materiał
                m.stock = fm.stock ?? m.stock
                m.minStock = fm.minStock ?? m.minStock
                m.price = fm.price ?? m.price
                m.supplier = fm.supplier ?? m.supplier
                m.location = fm.location ?? m.location
                m.unit = fm.unit ?? m.unit
              } else {
                // Dodaj nowy materiał z backendu
                const newMaterial = {
                  id: fm.id,
                  code: fm.name,
                  name: fm.name,
                  category: fm.category || ['_MATERIAL'],
                  unit: fm.unit || 'szt',
                  stock: fm.stock ?? 0,
                  minStock: fm.minStock ?? 0,
                  maxStock: (fm.minStock ?? 0) * 2,
                  supplier: fm.supplier || 'Unknown',
                  price: fm.price ?? 0,
                  location: fm.location || 'Unknown'
                } as any
                updatedMaterials.push(newMaterial)
              }
            }
            return { materials: updatedMaterials }
          })
        } catch (error) {
          console.error('Error syncing from backend:', error)
          // ignore for now
        }
      },

      purchaseRequests: [],
      supplierQuotes: [],
      stockReservations: [],
      deliveryTracking: [],

      // Purchase Requests
      addPurchaseRequest: (request) => set((state) => ({
        purchaseRequests: [...state.purchaseRequests, {
          ...request,
          id: crypto.randomUUID(),
          requestedAt: Date.now()
        }]
      })),

      updatePurchaseRequest: (id, updates) => set((state) => ({
        purchaseRequests: state.purchaseRequests.map(req =>
          req.id === id ? { ...req, ...updates } : req
        )
      })),

      removePurchaseRequest: (id) => set((state) => ({
        purchaseRequests: state.purchaseRequests.filter(req => req.id !== id)
      })),

      getPurchaseRequestsByProject: (projectId) =>
        get().purchaseRequests.filter(req => req.projectId === projectId),

      // Supplier Quotes
      addSupplierQuote: (quote) => set((state) => ({
        supplierQuotes: [...state.supplierQuotes, {
          ...quote,
          id: crypto.randomUUID()
        }]
      })),

      updateSupplierQuote: (id, updates) => set((state) => ({
        supplierQuotes: state.supplierQuotes.map(quote =>
          quote.id === id ? { ...quote, ...updates } : quote
        )
      })),

      removeSupplierQuote: (id) => set((state) => ({
        supplierQuotes: state.supplierQuotes.filter(quote => quote.id !== id)
      })),

      getQuotesByRequest: (purchaseRequestId) =>
        get().supplierQuotes.filter(quote => quote.purchaseRequestId === purchaseRequestId),

      // Stock Reservations
      addStockReservation: (reservation) => set((state) => ({
        stockReservations: [...state.stockReservations, {
          ...reservation,
          id: crypto.randomUUID(),
          reservedAt: Date.now()
        }]
      })),

      updateStockReservation: (id, updates) => set((state) => ({
        stockReservations: state.stockReservations.map(res =>
          res.id === id ? { ...res, ...updates } : res
        )
      })),

      removeStockReservation: (id) => set((state) => ({
        stockReservations: state.stockReservations.filter(res => res.id !== id)
      })),

      getReservationsByProject: (projectId) =>
        get().stockReservations.filter(res => res.projectId === projectId),

      // Delivery Tracking
      addDeliveryTracking: (delivery) => set((state) => ({
        deliveryTracking: [...state.deliveryTracking, {
          ...delivery,
          id: crypto.randomUUID()
        }]
      })),

      updateDeliveryTracking: (id, updates) => set((state) => ({
        deliveryTracking: state.deliveryTracking.map(del =>
          del.id === id ? { ...del, ...updates } : del
        )
      })),

      removeDeliveryTracking: (id) => set((state) => ({
        deliveryTracking: state.deliveryTracking.filter(del => del.id !== id)
      })),

      getDeliveriesByProject: (projectId) =>
        get().deliveryTracking.filter(del => del.projectId === projectId),
    }),
    {
      name: 'materials-store',
      version: 3,
      migrate: (persistedState: any) => {
        // Normalize categories to 2-level paths [main, sub]
        if (persistedState && Array.isArray(persistedState.materials)) {
          persistedState.materials = persistedState.materials.map((m: any) => {
            if (Array.isArray(m?.category)) {
              const [main, sub] = m.category
              return { ...m, category: [main, sub] }
            }
            // Fallback: derive from code if available
            if (typeof m?.code === 'string' && m.code.includes('/')) {
              const parts = m.code.split('/')
              const main = parts[0]
              const sub = parts[1]
              return { ...m, category: [main, sub] }
            }
            return m
          })
        }
        return persistedState
      },
      // Ensure inventory persists across rebuilds
      partialize: (state) => ({
        materials: state.materials,
        purchaseRequests: state.purchaseRequests,
        supplierQuotes: state.supplierQuotes,
        stockReservations: state.stockReservations,
        deliveryTracking: state.deliveryTracking
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // subscribe realtime
          const unsubscribe = subscribeTable<MaterialData>('materials', (rows: MaterialData[]) => {
            state.setMaterials(rows)
          }, (ids: string[]) => {
            state.setMaterials(state.materials.filter(m => !ids.includes(m.id)))
          })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ; (state as any)._unsubscribeMaterials = unsubscribe
        }
      }
    }
  )
)
