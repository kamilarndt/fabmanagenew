import type { Tile } from '../../types/tiles.types'

interface Group {
    id: string
    name: string
    tiles: Tile[]
}

interface GroupCardProps {
    group: Group
    onTileClick: (tile: Tile) => void
}

export default function GroupCard({ group, onTileClick }: GroupCardProps) {
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
        <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{group.name}</h6>
                <span className="badge bg-secondary">{group.tiles.length}</span>
            </div>
            <div className="card-body">
                <div className="d-flex flex-column gap-2">
                    {group.tiles.map(tile => (
                        <div 
                            key={tile.id} 
                            className="card border-0 bg-light" 
                            style={{ cursor: 'pointer' }}
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
                                        {tile.laborCost?.toLocaleString('pl-PL') || '0'} PLN
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                    {group.tiles.length === 0 && (
                        <div className="text-center text-muted small">Brak elementów</div>
                    )}
                </div>
            </div>
        </div>
    )
}
