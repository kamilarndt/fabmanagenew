import { useCallback } from 'react'
import { useDrop } from 'react-dnd'
import type { Tile } from '../../types/tiles.types'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
    columnId: 'nowy' | 'projektowanie' | 'cnc' | 'montaz'
    title: string
    color: string
    tiles: Tile[]
    onTileUpdate: (tileId: string, updates: Partial<Tile>) => void
    onTileClick: (tile: Tile) => void
    tileCosts: number[]
    projectTiles: Tile[]
}

const ItemTypes = { TILE: 'TILE' } as const

export default function KanbanColumn({ 
    columnId, 
    title, 
    color, 
    tiles, 
    onTileUpdate, 
    onTileClick,
    tileCosts,
    projectTiles
}: KanbanColumnProps) {
    const statusFromColumn = (columnId: string): Tile['status'] => {
        switch (columnId) {
            case 'nowy': return 'W KOLEJCE'
            case 'projektowanie': return 'Projektowanie'
            case 'cnc': return 'W TRAKCIE CIĘCIA'
            case 'montaz': return 'Gotowy do montażu'
            default: return 'W KOLEJCE'
        }
    }

    const [, drop] = useDrop<{ id: string }>(() => ({
        accept: ItemTypes.TILE,
        drop: (item) => {
            const newStatus = statusFromColumn(columnId)
            onTileUpdate(item.id, { status: newStatus })
        }
    }), [columnId, onTileUpdate])

    const dropRef = useCallback((el: HTMLDivElement | null) => {
        if (el) drop(el)
    }, [drop])

    return (
        <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100" ref={dropRef}>
                <div className={`card-header ${color} text-white d-flex justify-content-between align-items-center`}>
                    <h6 className="mb-0">{title}</h6>
                    <span className="badge bg-light text-dark">{tiles.length}</span>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-column gap-2">
                        {tiles.map(tile => {
                            const tileIndex = projectTiles.findIndex(t => t.id === tile.id)
                            const tileCost = tileIndex >= 0 ? tileCosts[tileIndex] : 0
                            
                            return (
                                <KanbanCard
                                    key={tile.id}
                                    tile={tile}
                                    onTileClick={onTileClick}
                                    tileCost={tileCost}
                                />
                            )
                        })}
                        {tiles.length === 0 && (
                            <div className="text-center text-muted small">Brak</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
