import type { Tile } from '../../types/tiles.types'
import KanbanColumn from './KanbanColumn'

interface KanbanBoardProps {
    projectTiles: Tile[]
    onTileUpdate: (tileId: string, updates: Partial<Tile>) => void
    onTileClick: (tile: Tile) => void
    tileCosts: number[]
}

const COLUMNS = [
    { id: 'nowy' as const, title: 'Nowy', color: 'bg-secondary' },
    { id: 'projektowanie' as const, title: 'Projektowanie', color: 'bg-warning' },
    { id: 'cnc' as const, title: 'Wycinanie CNC', color: 'bg-primary' },
    { id: 'montaz' as const, title: 'Składanie (Produkcja)', color: 'bg-success' }
] as const

export default function KanbanBoard({ projectTiles, onTileUpdate, onTileClick, tileCosts }: KanbanBoardProps) {
    const getKanbanStatus = (status: string) => {
        switch (status) {
            case 'W KOLEJCE': return 'nowy'
            case 'Projektowanie':
            case 'W trakcie projektowania':
            case 'Do akceptacji':
            case 'Wymagają poprawek':
                return 'projektowanie'
            case 'W TRAKCIE CIĘCIA':
            case 'WYCIĘTE':
                return 'cnc'
            case 'Gotowy do montażu':
            case 'Zaakceptowane':
                return 'montaz'
            default: return 'nowy'
        }
    }

    return (
        <div className="row g-3">
            {COLUMNS.map(column => (
                <KanbanColumn
                    key={column.id}
                    columnId={column.id}
                    title={column.title}
                    color={column.color}
                    tiles={projectTiles.filter(t => getKanbanStatus(t.status) === column.id)}
                    onTileUpdate={onTileUpdate}
                    onTileClick={onTileClick}
                    tileCosts={tileCosts}
                    projectTiles={projectTiles}
                />
            ))}
        </div>
    )
}
