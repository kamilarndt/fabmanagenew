import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Subcontractor, SubcontractorOrder, SubcontractorWithStats, SubcontractorCategory, OrderStatus } from '../types/subcontractors.types'
import { mockSubcontractors, mockSubcontractorOrders } from '../data/mockDatabase'

interface SubcontractorsState {
    subcontractors: Subcontractor[]
    orders: SubcontractorOrder[]
    selectedSubcontractor: Subcontractor | null
    selectedOrder: SubcontractorOrder | null
    filters: {
        category: SubcontractorCategory | 'All'
        status: 'All' | 'Aktywny' | 'Nieaktywny' | 'Zawieszony'
        search: string
    }
    sortBy: 'name' | 'rating' | 'category' | 'lastOrder'
    sortOrder: 'asc' | 'desc'
}

interface SubcontractorsActions {
    // Subcontractor management
    setSubcontractors: (subcontractors: Subcontractor[]) => void
    addSubcontractor: (subcontractor: Omit<Subcontractor, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateSubcontractor: (id: string, updates: Partial<Subcontractor>) => void
    deleteSubcontractor: (id: string) => void
    setSelectedSubcontractor: (subcontractor: Subcontractor | null) => void

    // Order management
    setOrders: (orders: SubcontractorOrder[]) => void
    addOrder: (order: Omit<SubcontractorOrder, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateOrder: (id: string, updates: Partial<SubcontractorOrder>) => void
    deleteOrder: (id: string) => void
    setSelectedOrder: (order: SubcontractorOrder | null) => void

    // Filtering and sorting
    setFilters: (filters: Partial<SubcontractorsState['filters']>) => void
    setSortBy: (sortBy: SubcontractorsState['sortBy']) => void
    setSortOrder: (sortOrder: SubcontractorsState['sortOrder']) => void

    // Computed data
    getFilteredSubcontractors: () => SubcontractorWithStats[]
    getSubcontractorOrders: (subcontractorId: string) => SubcontractorOrder[]
    getOrdersByStatus: (status: OrderStatus) => SubcontractorOrder[]

    // Initialize with mock data
    initialize: () => void
}

export const useSubcontractorsStore = create<SubcontractorsState & SubcontractorsActions>()(
    devtools(
        (set, get) => ({
            // Initial state
            subcontractors: [],
            orders: [],
            selectedSubcontractor: null,
            selectedOrder: null,
            filters: {
                category: 'All',
                status: 'All',
                search: ''
            },
            sortBy: 'name',
            sortOrder: 'asc',

            // Subcontractor management
            setSubcontractors: (subcontractors) => set({ subcontractors }),

            addSubcontractor: (subcontractorData) => {
                const newSubcontractor: Subcontractor = {
                    ...subcontractorData,
                    id: `SUB-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                set((state) => ({
                    subcontractors: [...state.subcontractors, newSubcontractor]
                }))
            },

            updateSubcontractor: (id, updates) => {
                set((state) => ({
                    subcontractors: state.subcontractors.map(sub =>
                        sub.id === id
                            ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
                            : sub
                    )
                }))
            },

            deleteSubcontractor: (id) => {
                set((state) => ({
                    subcontractors: state.subcontractors.filter(sub => sub.id !== id),
                    orders: state.orders.filter(order => order.subcontractorId !== id)
                }))
            },

            setSelectedSubcontractor: (subcontractor) => set({ selectedSubcontractor: subcontractor }),

            // Order management
            setOrders: (orders) => set({ orders }),

            addOrder: (orderData) => {
                const newOrder: SubcontractorOrder = {
                    ...orderData,
                    id: `ORD-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                set((state) => ({
                    orders: [...state.orders, newOrder]
                }))
            },

            updateOrder: (id, updates) => {
                set((state) => ({
                    orders: state.orders.map(order =>
                        order.id === id
                            ? { ...order, ...updates, updatedAt: new Date().toISOString() }
                            : order
                    )
                }))
            },

            deleteOrder: (id) => {
                set((state) => ({
                    orders: state.orders.filter(order => order.id !== id)
                }))
            },

            setSelectedOrder: (order) => set({ selectedOrder: order }),

            // Filtering and sorting
            setFilters: (newFilters) => {
                set((state) => ({
                    filters: { ...state.filters, ...newFilters }
                }))
            },

            setSortBy: (sortBy) => set({ sortBy }),
            setSortOrder: (sortOrder) => set({ sortOrder }),

            // Computed data
            getFilteredSubcontractors: () => {
                const { subcontractors, orders, filters, sortBy, sortOrder } = get()

                const filtered = subcontractors.filter(sub => {
                    const matchesCategory = filters.category === 'All' || sub.category === filters.category
                    const matchesStatus = filters.status === 'All' || sub.status === filters.status
                    const matchesSearch = filters.search === '' ||
                        sub.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                        sub.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
                        sub.specialties.some(s => s.toLowerCase().includes(filters.search.toLowerCase()))

                    return matchesCategory && matchesStatus && matchesSearch
                })

                // Add stats
                const withStats: SubcontractorWithStats[] = filtered.map(sub => {
                    const subOrders = orders.filter(order => order.subcontractorId === sub.id)
                    const completedOrders = subOrders.filter(order => order.status === 'Dostarczone')
                    const currentOrders = subOrders.filter(order =>
                        ['Zamówione', 'W produkcji', 'W transporcie'].includes(order.status)
                    )

                    return {
                        ...sub,
                        totalOrders: subOrders.length,
                        completedOrders: completedOrders.length,
                        averageRating: sub.rating,
                        lastOrderDate: subOrders.length > 0
                            ? subOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())[0].orderDate
                            : undefined,
                        currentOrders
                    }
                })

                // Sort
                withStats.sort((a, b) => {
                    let comparison = 0
                    switch (sortBy) {
                        case 'name':
                            comparison = a.name.localeCompare(b.name)
                            break
                        case 'rating':
                            comparison = a.rating - b.rating
                            break
                        case 'category':
                            comparison = a.category.localeCompare(b.category)
                            break
                        case 'lastOrder':
                            {
                                const aDate = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0
                                const bDate = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0
                                comparison = aDate - bDate
                            }
                            break
                    }
                    return sortOrder === 'asc' ? comparison : -comparison
                })

                return withStats
            },

            getSubcontractorOrders: (subcontractorId) => {
                const { orders } = get()
                return orders.filter(order => order.subcontractorId === subcontractorId)
            },

            getOrdersByStatus: (status) => {
                const { orders } = get()
                return orders.filter(order => order.status === status)
            },

            // Initialize with mock data
            initialize: () => {
                set({
                    subcontractors: mockSubcontractors,
                    orders: mockSubcontractorOrders
                })
            }
        }),
        {
            name: 'subcontractors-store'
        }
    )
)
