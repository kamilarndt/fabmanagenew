import { useMemo } from 'react'
import { useTilesStore } from '../../stores/tilesStore'
import MaterialsView from '../Materials/MaterialsView'

interface PurchaseItem {
    name: string
    unit: string
    quantity: number
    supplier?: string
}

interface ProjectMaterialsProps {
    purchaseList: PurchaseItem[]
    projectId?: string
}

export default function ProjectMaterials({ projectId }: ProjectMaterialsProps) {
    const { tiles } = useTilesStore()

    // Filtruj kafelki tylko dla tego projektu
    const projectTiles = useMemo(() => {
        if (!projectId) return tiles
        return tiles.filter(tile => tile.project === projectId)
    }, [tiles, projectId])

    return (
        <div>
            <MaterialsView tiles={projectTiles} />
        </div>
    )
}
