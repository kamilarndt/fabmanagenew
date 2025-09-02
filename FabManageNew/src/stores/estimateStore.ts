import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

export type EstimateMaterial = {
    id: string
    category: string
    name: string
    unit: string
    unitCost: number
    description?: string
}

type LineItem = { materialId: string; quantity: number }

type EstimateState = {
    lineItems: LineItem[]
    laborRate: number
    discountRate: number
    estimatedHours: number
    materials: Record<string, EstimateMaterial>
    addLineItem: (materialId: string) => void
    updateQuantity: (materialId: string, qty: number) => void
    removeLineItem: (materialId: string) => void
    setLaborRate: (rate: number) => void
    setDiscountRate: (rate: number) => void
    setEstimatedHours: (h: number) => void
    setMaterials: (list: EstimateMaterial[]) => void
    clearEstimate: () => void
}

export const useEstimateStore = create<EstimateState>()(
    (set, get) => ({
        lineItems: [],
        laborRate: 120,
        discountRate: 0,
        estimatedHours: 0,
        materials: {},
        addLineItem: (materialId) => {
            const exists = get().lineItems.find(li => li.materialId === materialId)
            if (exists) return
            set({ lineItems: [...get().lineItems, { materialId, quantity: 1 }] })
        },
        updateQuantity: (materialId, qty) => {
            set({
                lineItems: get().lineItems.map(li =>
                    li.materialId === materialId ? { ...li, quantity: Math.max(0, qty) } : li
                )
            })
        },
        removeLineItem: (materialId) => {
            set({ lineItems: get().lineItems.filter(li => li.materialId !== materialId) })
        },
        setLaborRate: (rate) => set({ laborRate: Math.max(0, rate) }),
        setDiscountRate: (rate) => set({ discountRate: Math.max(0, Math.min(100, rate)) }),
        setEstimatedHours: (h) => set({ estimatedHours: Math.max(0, h) }),
        setMaterials: (list) => {
            const map = Object.fromEntries(list.map(m => [m.id, m]))
            set({ materials: map })
        },
        clearEstimate: () => set({ lineItems: [], laborRate: 120, discountRate: 0, estimatedHours: 0 })
    })
)
