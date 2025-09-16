import type { Tile } from '../../types/tiles.types'
import KanbanColumn from '../Kanban/KanbanColumn'

type ColumnDef = { id: string; title: string; color: string }

type Props = {
    tiles: Tile[]
    columns: ColumnDef[]
    getColumnId: (tile: Tile) => string
    onTileUpdate: (tileId: string, updates: Partial<Tile>) => void
    onTileClick: (tile: Tile) => void
    tileCosts: number[]
}

export function KanbanBoardGeneric({ tiles, columns, getColumnId, onTileUpdate, onTileClick, tileCosts }: Props) {
    return (
        <div className="row g-3">
            {columns.map(col => (
                <KanbanColumn
                    key={col.id}
                    columnId={col.id as any}
                    title={col.title}
                    color={col.color}
                    tiles={tiles.filter(t => getColumnId(t) === col.id)}
                    onTileUpdate={onTileUpdate}
                    onTileClick={onTileClick}
                    tileCosts={tileCosts}
                    projectTiles={tiles}
                />
            ))}
        </div>
    )
}


