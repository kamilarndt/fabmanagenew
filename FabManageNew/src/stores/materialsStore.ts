import { create } from 'zustand'

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
            const base = (import.meta.env.VITE_API_BASE_URL as string) || ''
            let url = `${base}/api/materials`
            if (!base) url = '/api/materials'

            let res = await fetch(url)
            if (!res.ok && !base) {
                // Fallback for preview/prod without proxy
                res = await fetch('http://localhost:3001/api/materials')
            }
            if (!res.ok) throw new Error(`materials ${res.status}`)
            const data = await res.json()
            const mapped: MaterialItem[] = (Array.isArray(data) ? data : []).map((m: any) => {
                const categoryMain = String(m.category || '').toUpperCase()
                const categorySub = m.type ? String(m.type) : undefined
                const code = ['_MATERIAL', categoryMain, categorySub, (m.name || '').toString()].filter(Boolean).join('/')
                return {
                    id: String(m.id),
                    code,
                    name: m.name && m.name.length > 0 ? String(m.name) : `${categoryMain} ${categorySub || ''}`.trim(),
                    category: categorySub ? ['_MATERIAL', categoryMain] : ['_MATERIAL', categoryMain],
                    unit: String(m.unit || 'szt'),
                    price: Number(m.unitCost || 0),
                    stock: Number(m.quantity || 0),
                    minStock: 10,
                    maxStock: Math.max(Number(m.quantity || 0) * 2, 20),
                    supplier: 'Unknown',
                    location: undefined
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

