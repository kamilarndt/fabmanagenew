import { useMemo } from 'react'
import { useTilesStore } from '../stores/tilesStore'
import { useLogisticsStore } from '../stores/logisticsStore'
import { useAccommodationStore } from '../stores/accommodationStore'

interface ProjectCostSummary {
    materials: {
        total: number
        breakdown: { name: string; cost: number; quantity: number; unit: string }[]
    }
    labor: {
        total: number
        breakdown: { tileName: string; cost: number }[]
    }
    logistics: {
        total: number
        breakdown: { name: string; cost: number; type: string }[]
    }
    accommodation: {
        total: number
        breakdown: { name: string; cost: number; location: string }[]
    }
    totals: {
        subtotal: number
        margin: number
        discount: number
        vat: number
        total: number
    }
}

interface UseProjectCostsOptions {
    projectId: string
    marginPercent?: number
    discountPercent?: number
}

export function useProjectCosts({
    projectId,
    marginPercent = 15,
    discountPercent = 0
}: UseProjectCostsOptions): ProjectCostSummary {
    const { tiles } = useTilesStore()
    const logisticsStore = useLogisticsStore()
    const accommodationStore = useAccommodationStore()

    const projectTiles = useMemo(() =>
        tiles.filter(tile => tile.project === projectId),
        [tiles, projectId]
    )

    // Calculate materials costs from BOM in tiles
    const materialsCosts = useMemo(() => {
        const breakdown: { name: string; cost: number; quantity: number; unit: string }[] = []
        let total = 0

        projectTiles.forEach(tile => {
            tile.bom?.forEach(bomItem => {
                const cost = (bomItem.unitCost || 0) * bomItem.quantity
                total += cost
                breakdown.push({
                    name: bomItem.name,
                    cost,
                    quantity: bomItem.quantity,
                    unit: bomItem.unit
                })
            })
        })

        return { total, breakdown }
    }, [projectTiles])

    // Calculate labor costs from tiles
    const laborCosts = useMemo(() => {
        const breakdown: { tileName: string; cost: number }[] = []
        let total = 0

        projectTiles.forEach(tile => {
            const cost = tile.laborCost || 0
            total += cost
            if (cost > 0) {
                breakdown.push({
                    tileName: tile.name,
                    cost
                })
            }
        })

        return { total, breakdown }
    }, [projectTiles])

    // Calculate logistics costs from logistics store
    const logisticsCosts = useMemo(() => {
        const projectRoutes = logisticsStore.getRoutesByProject(projectId)
        const breakdown: { name: string; cost: number; type: string }[] = []

        // For now, estimate cost based on distance (2 PLN/km as basic estimation)
        const total = projectRoutes.reduce((sum: number, item: any) => {
            const cost = (item.distance || 0) * 2 // 2 PLN per km
            breakdown.push({
                name: item.fromLocation + ' → ' + item.toLocation,
                cost,
                type: item.vehicleType || 'Van'
            })
            return sum + cost
        }, 0)

        return { total, breakdown }
    }, [logisticsStore, projectId])

    // Calculate accommodation costs from accommodation store
    const accommodationCosts = useMemo(() => {
        const projectAccommodations = accommodationStore.byProject[projectId] || []
        const breakdown: { name: string; cost: number; location: string }[] = []

        const total = projectAccommodations.reduce((sum: number, item: any) => {
            const cost = item.cost || 0
            breakdown.push({
                name: item.hotelName,
                cost,
                location: item.address || ''
            })
            return sum + cost
        }, 0)

        return { total, breakdown }
    }, [accommodationStore, projectId])

    // Calculate totals with margin and VAT
    const totals = useMemo(() => {
        const subtotal = materialsCosts.total + laborCosts.total + logisticsCosts.total + accommodationCosts.total
        const margin = subtotal * (marginPercent / 100)
        const discount = (subtotal + margin) * (discountPercent / 100)
        const beforeVat = subtotal + margin - discount
        const vat = beforeVat * 0.23
        const total = beforeVat + vat

        return {
            subtotal,
            margin,
            discount,
            vat,
            total
        }
    }, [materialsCosts.total, laborCosts.total, logisticsCosts.total, accommodationCosts.total, marginPercent, discountPercent])

    return {
        materials: materialsCosts,
        labor: laborCosts,
        logistics: logisticsCosts,
        accommodation: accommodationCosts,
        totals
    }
}

