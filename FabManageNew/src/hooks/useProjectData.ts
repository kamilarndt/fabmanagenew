import { useMemo } from 'react'
import type { Project } from '../types/projects.types'
import type { Tile } from '../types/tiles.types'

export function useProjectData(project: Project, tiles: Tile[]) {
    const projectTiles = useMemo(() => {
        const filtered = tiles.filter(t => t.project === project.id)
        console.log('🔧 useProjectData DEBUG:', {
            projectId: project.id,
            allTilesCount: tiles.length,
            filteredTilesCount: filtered.length,
            allTileProjects: tiles.map(t => ({ id: t.id, name: t.name, project: t.project })),
            filtered: filtered
        })
        return filtered
    }, [tiles, project.id])

    const tileCosts = useMemo(() =>
        projectTiles.map(t =>
            (t.laborCost || 0) +
            (t.bom || []).reduce((a, b) =>
                a + (b.unitCost || 0) * (b.quantity || 0), 0
            )
        ),
        [projectTiles]
    )

    const purchaseList = useMemo(() => {
        const map = new Map<string, { name: string; unit: string; quantity: number; supplier?: string }>()
        projectTiles.forEach(t =>
            (t.bom || []).forEach(i => {
                if (i.status !== 'Do zamówienia') return
                const key = `${i.name}__${i.unit}__${i.supplier || ''}`
                const prev = map.get(key)
                if (prev) {
                    prev.quantity += (i.quantity || 0)
                } else {
                    map.set(key, {
                        name: i.name,
                        unit: i.unit,
                        quantity: i.quantity || 0,
                        supplier: i.supplier
                    })
                }
            })
        )
        return Array.from(map.values())
    }, [projectTiles])

    const groups = useMemo(() => {
        const m = new Map<string, { id: string; name: string; tiles: Tile[] }>()
        projectTiles.forEach(t => {
            const gid = t.group || 'ungrouped'
            const name = t.group || 'Bez grupy'
            const g = m.get(gid) || { id: gid, name, tiles: [] }
            g.tiles.push(t)
            m.set(gid, g)
        })
        return Array.from(m.values())
    }, [projectTiles])

    const totalProjectCost = useMemo(() =>
        tileCosts.reduce((sum, cost) => sum + cost, 0),
        [tileCosts]
    )

    const projectProgress = useMemo(() => {
        if (projectTiles.length === 0) return 0

        const completedTiles = projectTiles.filter(t =>
            t.status === 'Gotowy do montażu' || t.status === 'Zaakceptowane'
        ).length

        return Math.round((completedTiles / projectTiles.length) * 100)
    }, [projectTiles])

    return {
        projectTiles,
        tileCosts,
        purchaseList,
        groups,
        totalProjectCost,
        projectProgress
    }
}
