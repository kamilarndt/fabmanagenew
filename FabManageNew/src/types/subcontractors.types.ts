export type SubcontractorCategory = 'Tapicer' | 'Stal' | 'Tworzywa sztuczne' | 'Szklarz' | 'Drukarnia' | 'Inne'

export type SubcontractorStatus = 'Aktywny' | 'Nieaktywny' | 'Zawieszony'

export type OrderStatus = 'Do zamówienia' | 'Zamówione' | 'W produkcji' | 'W transporcie' | 'Dostarczone' | 'Anulowane'

export interface Subcontractor {
    id: string
    name: string
    category: SubcontractorCategory
    logo?: string
    contactPerson: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    website?: string
    rating: number // 1-5
    status: SubcontractorStatus
    description?: string
    specialties: string[]
    capacity: {
        maxOrders: number
        currentOrders: number
    }
    pricing: {
        minOrder: number
        averageCost: number
        currency: string
    }
    deliveryTime: {
        standard: number // dni
        rush: number // dni
    }
    notes: string[]
    createdAt: string
    updatedAt: string
}

export interface SubcontractorOrder {
    id: string
    subcontractorId: string
    tileId: string
    projectId: string
    title: string
    description: string
    status: OrderStatus
    orderDate: string
    deadline: string
    cost: number
    currency: string
    quantity: number
    specifications: string[]
    attachments: string[]
    notes: string
    progress: number // 0-100
    createdAt: string
    updatedAt: string
}

export interface SubcontractorWithStats extends Subcontractor {
    totalOrders: number
    completedOrders: number
    averageRating: number
    lastOrderDate?: string
    currentOrders: SubcontractorOrder[]
}
