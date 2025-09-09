import { useCallback, useMemo, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useTilesStore, type Tile } from '../stores/tilesStore'
import TileEditModal from '../components/Tiles/TileEditModal'

type DesignStatus = 'Projektowanie' | 'W trakcie projektowania' | 'Do akceptacji' | 'Zaakceptowane' | 'Wymagają poprawek'

export default function Projektowanie() {
    const { tiles, updateTile } = useTilesStore()
    const [selected, setSelected] = useState<Tile | null>(null)
    const [showTileModal, setShowTileModal] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)

    // Filter tiles that are relevant for the design board
    // Include any tile already moved into one of the design statuses
    const designTiles = useMemo(() => {
        const designStatuses: DesignStatus[] = [
            'Projektowanie',
            'W trakcie projektowania',
            'Do akceptacji',
            'Zaakceptowane',
            'Wymagają poprawek'
        ]
        return tiles.filter(tile => designStatuses.includes(tile.status as DesignStatus))
    }, [tiles])

    const columns: { key: DesignStatus; label: string; color: string }[] = [
        { key: 'Projektowanie', label: 'Nowe Zlecenia', color: 'text-muted' },
        { key: 'W trakcie projektowania', label: 'W Trakcie Projektowania', color: 'text-primary' },
        { key: 'Do akceptacji', label: 'Do Akceptacji', color: 'text-warning' },
        { key: 'Zaakceptowane', label: 'Zaakceptowane', color: 'text-success' },
        { key: 'Wymagają poprawek', label: 'Wymagają Poprawek', color: 'text-danger' },
    ]

    const byColumn = useMemo(() =>
        Object.fromEntries(columns.map(c => [c.key, designTiles.filter(t => t.status === c.key)])) as Record<DesignStatus, Tile[]>,
        [designTiles, columns]
    )

    const moveTile = (id: string, status: DesignStatus) => {
        updateTile(id, { status })
    }

    const handleEditTile = (tile: Tile) => {
        setEditingTile(tile)
        setShowTileModal(true)
    }

    const handleSaveTile = (tileData: Omit<Tile, 'id'>) => {
        if (editingTile) {
            updateTile(editingTile.id, tileData)
        }
        setShowTileModal(false)
        setEditingTile(null)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Dział Projektowy</h4>
                    <p className="text-muted mb-0">Zarządzanie zadaniami projektowymi</p>
                </div>
                <div className="d-flex gap-2">
                    <span className="badge bg-primary fs-6">{designTiles.length} zadań</span>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-xl-9">
                    <div className="row g-3">
                        {columns.map(col => (
                            <div className="col-12 col-md-6 col-xl-4" key={col.key}>
                                <div className="card h-100">
                                    <div className="card-header fw-semibold d-flex align-items-center justify-content-between">
                                        <span className={col.color}>{col.label}</span>
                                        <span className="badge bg-label-secondary">{byColumn[col.key].length}</span>
                                    </div>
                                    <ColumnDrop onDrop={(id) => moveTile(id, col.key)}>
                                        {byColumn[col.key].map(tile => (
                                            <DesignCardItem
                                                key={tile.id}
                                                tile={tile}
                                                onSelect={() => setSelected(tile)}
                                                onEdit={() => handleEditTile(tile)}
                                                onAccept={() => moveTile(tile.id, 'Zaakceptowane')}
                                                onNeedsFix={() => moveTile(tile.id, 'Wymagają poprawek')}
                                            />
                                        ))}
                                        {byColumn[col.key].length === 0 && <p className="text-muted">Brak zadań</p>}
                                    </ColumnDrop>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-12 col-xl-3">
                    <div className="card">
                        <div className="card-header fw-semibold">Szczegóły</div>
                        <div className="card-body">
                            {!selected && <div className="text-muted">Wybierz kafelek po lewej</div>}
                            {selected && (
                                <div>
                                    <div className="h5 mb-2">{selected.name}</div>
                                    <div className="text-muted small mb-2">
                                        {selected.project} • {selected.assignee || 'Nieprzypisany'}
                                    </div>
                                    <div className="mb-2">
                                        <span className="badge bg-label-primary me-2">{selected.status}</span>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">Koszt robocizny: {selected.laborCost || 0} PLN</small>
                                    </div>
                                    <hr />
                                    <div className="text-muted small mb-2">Komponenty BOM ({selected.bom?.length || 0})</div>
                                    <ul className="list-unstyled mb-0">
                                        {selected.bom?.slice(0, 3).map((item, idx) => (
                                            <li key={idx} className="py-1 border-bottom small">
                                                {item.name} - {item.quantity} {item.unit}
                                            </li>
                                        ))}
                                        {(!selected.bom || selected.bom.length === 0) && (
                                            <li className="py-1 text-muted">Brak komponentów</li>
                                        )}
                                    </ul>
                                    <div className="mt-3">
                                        <button className="btn btn-sm btn-outline-primary w-100" onClick={() => handleEditTile(selected)}>
                                            <i className="ri-edit-line me-1"></i>Edytuj
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tile Edit Modal */}
            <TileEditModal
                open={showTileModal}
                onClose={() => {
                    setShowTileModal(false)
                    setEditingTile(null)
                }}
                onSave={handleSaveTile}
                tile={editingTile || undefined}
                projectId={editingTile?.project}
            />
        </div>
    )
}

function DesignCardItem({ tile, onSelect, onEdit, onAccept, onNeedsFix }: {
    tile: Tile;
    onSelect: () => void;
    onEdit: () => void;
    onAccept?: () => void;
    onNeedsFix?: () => void
}) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'DESIGN_CARD',
        item: { id: tile.id },
        collect: m => ({ isDragging: m.isDragging() })
    }), [tile.id])

    const refCb = useCallback((el: HTMLDivElement | null) => { if (el) drag(el) }, [drag])

    return (
        <div ref={refCb} className="card m-2 border" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={onSelect}>
            <div className="card-body py-2">
                <div className="fw-semibold">{tile.name}</div>
                <div className="text-muted small">{tile.project} • {tile.assignee || 'Nieprzypisany'}</div>
                <div className="d-flex justify-content-between mt-1 align-items-center">
                </div>
                <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                        <i className="ri-edit-line"></i>
                    </button>
                    {onAccept && (
                        <button className="btn btn-sm btn-outline-success" onClick={(e) => { e.stopPropagation(); onAccept(); }}>
                            <i className="ri-check-line"></i>
                        </button>
                    )}
                    {onNeedsFix && (
                        <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); onNeedsFix(); }}>
                            <i className="ri-close-line"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function ColumnDrop({ onDrop, children }: { onDrop: (id: string) => void; children: React.ReactNode }) {
    const [, drop] = useDrop(() => ({
        accept: 'DESIGN_CARD',
        drop: (item: any) => onDrop(item.id)
    }), [onDrop])

    const refCb = useCallback((el: HTMLDivElement | null) => { if (el) drop(el) }, [drop])

    return <div ref={refCb} className="card-body">{children}</div>
}


