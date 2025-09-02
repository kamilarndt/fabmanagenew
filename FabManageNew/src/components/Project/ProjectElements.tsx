import { useState, useMemo } from 'react'
import type { Tile } from '../../types/tiles.types'
import type { Project } from '../../types/projects.types'
import KanbanBoard from '../Kanban/KanbanBoard'
import GroupView from '../Groups/GroupView'
import { useTilesStore } from '../../stores/tilesStore'
import { showToast } from '../../lib/toast'

interface ProjectElementsProps {
    project: Project
    projectTiles: Tile[]
    tileCosts: number[]
    onTileUpdate: (tileId: string, updates: Partial<Tile>) => void
    onTileClick: (tile: Tile) => void
    onAddTile: () => void
    onCreateGroup: () => void
    onPushToProduction?: () => void
}

export default function ProjectElements({
    project,
    projectTiles,
    tileCosts,
    onTileUpdate,
    onTileClick,
    onAddTile,
    onCreateGroup,
    onPushToProduction
}: ProjectElementsProps) {
    const { addTile } = useTilesStore()

    // Quick add state
    const [qaName, setQaName] = useState('')
    const [qaTech, setQaTech] = useState('Frezowanie CNC')
    const [qaPriority, setQaPriority] = useState<'Wysoki' | 'Średni' | 'Niski'>('Średni')

    const groups = useMemo(() => {
        const dict: Record<string, { id: string; name: string; tiles: Tile[] }> = {};
        // Seed with declared project groups (allow empty)
        (project.groups || []).forEach((g: { id: string; name: string }) => {
            const name = g.name
            dict[name] = { id: g.id, name, tiles: [] }
        })
        // Ensure default group exists
        if (!dict['Bez grupy']) dict['Bez grupy'] = { id: 'ungrouped', name: 'Bez grupy', tiles: [] }
        // Attach tiles to groups by name
        projectTiles.forEach(t => {
            const name = t.group || 'Bez grupy'
            if (!dict[name]) dict[name] = { id: name, name, tiles: [] }
            dict[name].tiles.push(t)
        })
        return Object.values(dict)
    }, [projectTiles, project.groups])

    const handleQuickAdd = async () => {
        const name = qaName.trim()
        if (!name) {
            showToast('Podaj nazwę elementu', 'warning')
            return
        }
        const newTile: Tile = {
            id: crypto.randomUUID(),
            name,
            status: 'W KOLEJCE',
            project: project.id,
            priority: qaPriority,
            technology: qaTech,
            laborCost: 0,
            bom: []
        }
        await addTile(newTile)
        showToast('Dodano element', 'success')
        setQaName('')
    }

    return (
        <div>
            {/* Header + Quick Add */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">Elementy Projektu</h5>
                    <p className="text-muted small mb-0">Kanban na górze, grupy poniżej</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-success btn-sm" onClick={onCreateGroup} aria-label="Stwórz nową grupę">
                        <i className="ri-add-circle-line me-1"></i>Stwórz grupę
                    </button>
                    {project.modules?.includes('produkcja') && onPushToProduction && (
                        <button className="btn btn-warning btn-sm" onClick={onPushToProduction} aria-label="Wyślij elementy do produkcji">
                            <i className="ri-send-plane-line me-1"></i>Wyślij do produkcji
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Add Bar */}
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label small fw-semibold">Nazwa elementu *</label>
                            <input className="form-control" placeholder="np. Panel frontowy" value={qaName} onChange={e => setQaName(e.currentTarget.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Technologia wiodąca</label>
                            <select className="form-select" value={qaTech} onChange={e => setQaTech(e.currentTarget.value)}>
                                <option>Frezowanie CNC</option>
                                <option>Cięcie laserowe</option>
                                <option>Druk 3D</option>
                                <option>Gięcie blach</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-semibold">Priorytet</label>
                            <select className="form-select" value={qaPriority} onChange={e => setQaPriority(e.currentTarget.value as any)}>
                                <option>Wysoki</option>
                                <option>Średni</option>
                                <option>Niski</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-grid">
                            <button className="btn btn-primary" onClick={handleQuickAdd}>
                                <i className="ri-add-line me-1"></i>Dodaj
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 text-muted small">
                        Potrzebujesz więcej pól? Użyj edytora zaawansowanego
                        <button className="btn btn-link btn-sm ms-1 p-0 align-baseline" onClick={onAddTile}>Otwórz edytor</button>
                    </div>
                </div>
            </div>

            {/* Kanban */}
            <KanbanBoard
                projectTiles={projectTiles}
                onTileUpdate={onTileUpdate}
                onTileClick={onTileClick}
                tileCosts={tileCosts}
            />

            {/* Groups below */}
            <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Grupy</h6>
                    <button className="btn btn-outline-secondary btn-sm" onClick={onCreateGroup} aria-label="Utwórz nową grupę">
                        <i className="ri-folder-add-line me-1"></i>Nowa grupa
                    </button>
                </div>
                <GroupView
                    groups={groups}
                    onTileClick={onTileClick}
                />
            </div>
        </div>
    )
}
