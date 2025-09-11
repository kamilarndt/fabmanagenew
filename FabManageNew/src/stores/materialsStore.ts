import { create } from 'zustand'
import { config } from '../lib/config'

export type MaterialItem = {
    id: string
    code: string
    name: string
    category: string[]
    unit: string
    stock: number
    minStock: number
    maxStock: number
    supplier: string
    location?: string
    price: number
    thickness?: number
    variant?: string
    abcClass?: 'A' | 'B' | 'C'
}

export type PurchaseRequest = {
    id: string
    projectId: string
    materialId: string
    materialName: string
    quantity: number
    unit: string
    requestedBy: string
    requestedAt: number
    status: 'pending' | 'ordered' | 'received'
    priority: 'low' | 'medium' | 'high'
    notes?: string
}

export type StockReservation = {
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

type MaterialsState = {
    materials: MaterialItem[]
    purchaseRequests: PurchaseRequest[]
    stockReservations: StockReservation[]
    deliveries: DeliveryTracking[]

    syncFromBackend: () => Promise<void>
    updateMaterialStock: (materialId: string, nextQuantity: number) => void
    adjustMaterialStock: (materialId: string, delta: number) => void
    addPurchaseRequest: (req: Partial<PurchaseRequest>) => void
    removePurchaseRequest: (id: string) => void
    getPurchaseRequestsByProject: (projectId: string) => PurchaseRequest[]
    addStockReservation: (res: Partial<StockReservation>) => void
    removeStockReservation: (id: string) => void
    getReservationsByProject: (projectId: string) => StockReservation[]
    addDeliveryTracking: (d: Partial<DeliveryTracking>) => void
    removeDeliveryTracking: (id: string) => void
    getDeliveriesByProject: (projectId: string) => DeliveryTracking[]
}

export type DeliveryTracking = {
    id: string
    projectId: string
    materialId: string
    materialName: string
    quantity: number
    unit: string
    supplierName: string
    expectedDelivery: number
    status: 'ordered' | 'in_transit' | 'delayed' | 'delivered'
    trackingNumber?: string
    notes?: string
}

export const useMaterialsStore = create<MaterialsState>()((set, get) => ({
    materials: [],
    purchaseRequests: [],
    stockReservations: [],
    deliveries: [],

    syncFromBackend: async () => {
        try {
            // Use realistic mock data in development mode
            if (config.useMockData) {
                const { mockMaterials } = await import('../data/development')

                const mapped: MaterialItem[] = mockMaterials.map((m: any) => ({
                    id: m.id,
                    code: m.code,
                    name: m.name,
                    category: [m.category, m.type].filter(Boolean),
                    unit: m.unit,
                    price: m.cena || m.unitCost || 0,
                    stock: m.quantity || 0,
                    minStock: Math.floor((m.quantity || 0) * 0.2),
                    maxStock: Math.floor((m.quantity || 0) * 1.5),
                    supplier: m.supplier,
                    location: m.location,
                    thickness: m.grubosc || undefined,
                    variant: m.typ || undefined,
                    abcClass: m.quantity > 50 ? 'A' : m.quantity > 20 ? 'B' : 'C'
                }))

                set({ materials: mapped })
                console.log(`📦 Loaded ${mapped.length} realistic materials`)
                return
            }

            const { api } = await import('../lib/httpClient')

            const data = await api.call<any[]>('/api/materials', {
                method: 'GET',
                table: 'materials',
                useSupabase: false
            })

            const mapped: MaterialItem[] = (Array.isArray(data) ? data : []).map((m: any) => {
                const categoryMainRaw = (m.category ?? '').toString().trim()
                const categoryMain = categoryMainRaw.length ? categoryMainRaw.toUpperCase() : 'UNKNOWN'
                const categorySubRaw = (m.type ?? '').toString().trim()
                const categorySub = categorySubRaw.length ? categorySubRaw : undefined
                const nameRaw = (m.name ?? '').toString().trim()
                const formatRaw = (m.format_raw ?? '').toString().trim()

                // Deterministic display name
                const displayName = nameRaw.length
                    ? nameRaw
                    : [categoryMain, categorySub].filter(Boolean).join(' ')

                // Category path includes root and main; sub is represented in code and search
                const categoryPath = ['_MATERIAL', categoryMain]

                const codeParts = ['_MATERIAL', categoryMain]
                if (categorySub) codeParts.push(categorySub)
                if (nameRaw.length) codeParts.push(nameRaw)
                if (formatRaw.length) codeParts.push(formatRaw)
                const code = codeParts.join('/')

                return {
                    id: String(m.id),
                    code,
                    name: displayName,
                    category: categoryPath,
                    unit: String(m.unit || 'szt'),
                    price: Number(m.unitCost || 0),
                    stock: Number(m.quantity || 0),
                    minStock: 10,
                    maxStock: Math.max(Number(m.quantity || 0) * 2, 20),
                    supplier: (m.supplier || 'Unknown') as string,
                    location: (m.location || undefined) as string | undefined
                }
            })
            set({ materials: mapped })
        } catch (e) {
            console.warn('materials sync failed:', (e as Error).message)
        }
    },

    updateMaterialStock: (materialId: string, nextQuantity: number) => {
        set(state => ({
            materials: state.materials.map(m => m.id === materialId ? { ...m, stock: Math.max(0, nextQuantity) } : m)
        }))
    },

    adjustMaterialStock: (materialId: string, delta: number) => {
        set(state => ({
            materials: state.materials.map(m => m.id === materialId ? { ...m, stock: Math.max(0, m.stock + delta) } : m)
        }))
    },

    addPurchaseRequest: (req: Partial<PurchaseRequest>) => {
        const full: PurchaseRequest = {
            id: req.id || `pr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            projectId: req.projectId || '',
            materialId: req.materialId || '',
            materialName: req.materialName || '',
            quantity: Number(req.quantity || 0),
            unit: req.unit || 'szt',
            requestedBy: req.requestedBy || 'System',
            requestedAt: req.requestedAt || Date.now(),
            status: req.status || 'pending',
            priority: req.priority || 'medium',
            notes: req.notes
        }
        set(state => ({ purchaseRequests: [...state.purchaseRequests, full] }))
    },

    removePurchaseRequest: (id: string) => {
        set(state => ({ purchaseRequests: state.purchaseRequests.filter(x => x.id !== id) }))
    },

    getPurchaseRequestsByProject: (projectId: string) => {
        return get().purchaseRequests.filter(x => x.projectId === projectId)
    },

    addStockReservation: (res: Partial<StockReservation>) => {
        const full: StockReservation = {
            id: res.id || `res-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            projectId: res.projectId || '',
            materialId: res.materialId || '',
            materialName: res.materialName || '',
            quantity: Number(res.quantity || 0),
            unit: res.unit || 'szt',
            reservedAt: res.reservedAt || Date.now(),
            reservedBy: res.reservedBy || 'System',
            status: res.status || 'reserved'
        }
        set(state => ({ stockReservations: [...state.stockReservations, full] }))
    },

    removeStockReservation: (id: string) => {
        set(state => ({ stockReservations: state.stockReservations.filter(x => x.id !== id) }))
    },

    getReservationsByProject: (projectId: string) => {
        return get().stockReservations.filter(x => x.projectId === projectId)
    },

    addDeliveryTracking: (d: Partial<DeliveryTracking>) => {
        const full: DeliveryTracking = {
            id: d.id || `dlv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            projectId: d.projectId || '',
            materialId: d.materialId || '',
            materialName: d.materialName || '',
            quantity: Number(d.quantity || 0),
            unit: d.unit || 'szt',
            supplierName: d.supplierName || 'Unknown',
            expectedDelivery: d.expectedDelivery || Date.now(),
            status: d.status || 'ordered',
            trackingNumber: d.trackingNumber,
            notes: d.notes
        }
        set(state => ({ deliveries: [...state.deliveries, full] }))
    },

    removeDeliveryTracking: (id: string) => {
        set(state => ({ deliveries: state.deliveries.filter(x => x.id !== id) }))
    },

    getDeliveriesByProject: (projectId: string) => {
        return get().deliveries.filter(x => x.projectId === projectId)
    }
}))

