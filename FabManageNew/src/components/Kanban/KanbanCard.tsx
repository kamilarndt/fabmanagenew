import { useDrag } from 'react-dnd'
import type { Tile } from '../../types/tiles.types'

interface KanbanCardProps {
    tile: Tile
    onTileClick: (tile: Tile) => void
    tileCost?: number
}

const ItemTypes = { TILE: 'TILE' } as const

export default function KanbanCard({ tile, onTileClick, tileCost }: KanbanCardProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TILE,
        item: { id: tile.id },
        collect: (monitor) => ({ isDragging: monitor.isDragging() })
    }), [tile.id])

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-success'
            case 'On Hold': return 'bg-warning'
            case 'Done': return 'bg-info'
            case 'W KOLEJCE': return 'bg-secondary'
            case 'W TRAKCIE CIĘCIA': return 'bg-primary'
            case 'WYCIĘTE': return 'bg-info'
            case 'Projektowanie': return 'bg-warning'
            case 'W trakcie projektowania': return 'bg-warning'
            case 'Do akceptacji': return 'bg-warning'
            case 'Zaakceptowane': return 'bg-success'
            case 'Wymagają poprawek': return 'bg-danger'
            case 'Gotowy do montażu': return 'bg-success'
            default: return 'bg-secondary'
        }
    }

    return (
        <div
            ref={drag as unknown as React.RefObject<HTMLDivElement>}
            className="card border-0 bg-light"
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab'
            }}
            onClick={() => onTileClick(tile)}
        >
            <div className="card-body p-2">
                <h6 className="mb-1 text-truncate">{tile.name}</h6>
                <small className="text-muted d-block">{tile.id}</small>
                <div className="d-flex justify-content-between align-items-center mt-1">
                    <span className={`badge ${getStatusBadgeClass(tile.status)}`}>
                        {tile.status}
                    </span>
                    <small className="text-muted">
                        {tileCost?.toLocaleString('pl-PL') || '0'} PLN
                    </small>
                </div>
            </div>
        </div>
    )
}
