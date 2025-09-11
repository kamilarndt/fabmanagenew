import { useCallback, useMemo, useState } from 'react'
import { Select, Button, Switch } from 'antd'
import { useDrag, useDrop } from 'react-dnd'
import { useTilesStore, type Tile } from '../stores/tilesStore'
import TileEditModalV3 from '../components/Tiles/TileEditModalV3'
import { useProjectsStore } from '../stores/projectsStore'

type DesignStatus = 'Projektowanie' | 'W trakcie projektowania' | 'Do akceptacji' | 'Zaakceptowane' | 'Wymagają poprawek'

export default function Projektowanie() {
    const { tiles, updateTile } = useTilesStore()
    const { projectsById } = useProjectsStore()
    const { projects } = useProjectsStore()
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

    // Project filter state
    const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all')
    const [onlySelectedProject, setOnlySelectedProject] = useState<boolean>(false)

    // Apply project filter when toggle is enabled and a project is selected
    const filteredDesignTiles = useMemo(() => {
        if (onlySelectedProject && selectedProjectId !== 'all') {
            return designTiles.filter(t => t.project === selectedProjectId)
        }
        return designTiles
    }, [designTiles, onlySelectedProject, selectedProjectId])

    const columns: { key: DesignStatus; label: string; color: string }[] = [
        { key: 'Projektowanie', label: 'Nowe Zlecenia', color: 'text-muted' },
        { key: 'W trakcie projektowania', label: 'W Trakcie Projektowania', color: 'text-primary' },
        { key: 'Do akceptacji', label: 'Do Akceptacji', color: 'text-warning' },
        { key: 'Zaakceptowane', label: 'Zaakceptowane', color: 'text-success' },
        { key: 'Wymagają poprawek', label: 'Wymagają Poprawek', color: 'text-danger' },
    ]

    const byColumn = useMemo(() =>
        Object.fromEntries(columns.map(c => [c.key, filteredDesignTiles.filter(t => t.status === c.key)])) as Record<DesignStatus, Tile[]>,
        [filteredDesignTiles, columns]
    )

    // Group tiles inside each column by project id
    const byColumnGrouped = useMemo(() => {
        const result = {} as Record<DesignStatus, Record<string, Tile[]>>
        (columns.map(c => c.key) as DesignStatus[]).forEach(colKey => {
            const items = byColumn[colKey] || []
            const groups: Record<string, Tile[]> = {}
            for (const t of items) {
                const pid = t.project || '—'
                if (!groups[pid]) groups[pid] = []
                groups[pid].push(t)
            }
            result[colKey] = groups
        })
        return result
    }, [byColumn, columns])

    // Expand/collapse state per column+project
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const toggleGroup = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
    const isExpanded = (key: string) => expanded[key] !== false

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
                <div className="d-flex gap-2 align-items-center">
                    <Select
                        size="small"
                        style={{ minWidth: 240 }}
                        value={selectedProjectId}
                        onChange={(val) => setSelectedProjectId(val)}
                        options={[
                            { value: 'all', label: 'Wszystkie projekty' },
                            ...((projects || []).map(p => ({ value: p.id, label: p.name })))]}
                    />
                    <div className="d-flex align-items-center gap-1">
                        <Switch
                            size="small"
                            checked={onlySelectedProject}
                            onChange={(v) => setOnlySelectedProject(v)}
                        />
                        <span className="small text-muted">Pokaż tylko wybrany projekt</span>
                    </div>
                    <span className="badge bg-primary fs-6">{filteredDesignTiles.length} zadań</span>
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
                                        {Object.entries(byColumnGrouped[col.key] || {}).length === 0 && (
                                            <p className="text-muted">Brak zadań</p>
                                        )}
                                        {Object.entries(byColumnGrouped[col.key] || {})
                                            .sort(([a], [b]) => {
                                                const an = projectsById[a]?.name || a
                                                const bn = projectsById[b]?.name || b
                                                return an.localeCompare(bn)
                                            })
                                            .map(([projectId, items]) => {
                                                const headerKey = `${col.key}:${projectId}`
                                                const name = projectsById[projectId]?.name || projectId
                                                return (
                                                    <div key={headerKey} className="border-bottom">
                                                        <div className="d-flex justify-content-between align-items-center px-2 py-1 bg-light">
                                                            <div className="fw-semibold text-truncate" title={name}>{name}</div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="badge bg-label-secondary">{items.length}</span>
                                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleGroup(headerKey)}>
                                                                    {isExpanded(headerKey) ? 'Zwiń' : 'Rozwiń'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {isExpanded(headerKey) && (
                                                            <div>
                                                                {items.map(tile => (
                                                                    <DesignCardItem
                                                                        key={tile.id}
                                                                        tile={tile}
                                                                        onSelect={() => setSelected(tile)}
                                                                        onEdit={() => handleEditTile(tile)}
                                                                        onAccept={() => moveTile(tile.id, 'Zaakceptowane')}
                                                                        onNeedsFix={() => moveTile(tile.id, 'Wymagają poprawek')}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
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
                                        <div className="text-muted small mb-1">Przypisz projektanta (Push)</div>
                                        <div className="d-flex gap-2">
                                            <Select
                                                style={{ minWidth: 180 }}
                                                size="small"
                                                placeholder="Wybierz projektanta"
                                                value={selected.przypisany_projektant || undefined}
                                                onChange={(val) => updateTile(selected.id, { przypisany_projektant: val, status: 'W trakcie projektowania' as any })}
                                                options={[
                                                    { value: 'Anna Kowalska', label: 'Anna Kowalska' },
                                                    { value: 'Piotr Nowak', label: 'Piotr Nowak' },
                                                    { value: 'Kamil Arndt', label: 'Kamil Arndt' }
                                                ]}
                                            />
                                            <Button size="small" onClick={async () => {
                                                await updateTile(selected.id, { status: 'W trakcie projektowania' as any })
                                                try {
                                                    const { useCalendarStore } = await import('../stores/calendarStore')
                                                    const title = `Projekt: ${selected.name}`
                                                    useCalendarStore.getState().autoSchedule({
                                                        resourceId: 'designer-1',
                                                        tasks: [{ title, durationH: 2, meta: { tileId: selected.id, projectId: selected.project }, phase: 'projektowanie' }]
                                                    })
                                                } catch {
                                                    // noop
                                                }
                                            }}>Przypisz</Button>
                                        </div>
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
                    <div className="card mt-3">
                        <div className="card-header fw-semibold">Pula Zadań (Pull)</div>
                        <div className="card-body">
                            {tiles.filter(t => t.status === 'W KOLEJCE' && (!onlySelectedProject || selectedProjectId === 'all' ? true : t.project === selectedProjectId)).map(t => (
                                <div key={t.id} className="d-flex justify-content-between align-items-center py-1">
                                    <div className="small text-truncate" style={{ maxWidth: 160 }}>{t.name}</div>
                                    <button className="btn btn-sm btn-outline-success" onClick={() => updateTile(t.id, { status: 'W trakcie projektowania' })}>Weź</button>
                                </div>
                            ))}
                            {tiles.filter(t => t.status === 'W KOLEJCE' && (!onlySelectedProject || selectedProjectId === 'all' ? true : t.project === selectedProjectId)).length === 0 && (
                                <div className="text-muted small">Brak dostępnych zadań</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tile Edit Modal */}
            <TileEditModalV3
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


