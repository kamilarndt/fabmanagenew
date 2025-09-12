import { useState, useMemo } from 'react'
import type { Tile } from '../../types/tiles.types'
import type { Project } from '../../types/projects.types'
import GroupView from '../Groups/GroupView'
import { useTilesStore } from '../../stores/tilesStore'
import { showToast } from '../../lib/notifications'
import { Card, Form, Input, Button, Space, Row, Col, Tabs, message } from 'antd'
import TileCard from '../Tiles/TileCard'
import TileEditDrawer from '../Tiles/tile-edit-drawer'
import { createTileFromSelection } from '../../services/tiles'
import { useProjectsStore } from '../../stores/projectsStore'
import { showNotification } from '../../lib/notifications'
import SpeckleViewer from '../SpeckleViewer'

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
    onTileUpdate,
    onTileClick,
    onCreateGroup,
    onPushToProduction
}: ProjectElementsProps) {
    const { addTile } = useTilesStore()
    const updateProjectModel = useProjectsStore((s: any) => s.updateProjectModel)

    // DEBUG: Log tiles data for debugging
    console.log('🔧 ProjectElements DEBUG:', {
        projectId: project?.id,
        projectName: project?.name,
        projectTilesCount: projectTiles?.length || 0,
        projectTiles: projectTiles,
        hasModules: project?.modules?.length || 0,
        modules: project?.modules
    })

    // Quick add state
    const [qaName, setQaName] = useState('')
    const [modelUrl, setModelUrl] = useState(project.link_model_3d || '')

    // Tile edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)

    // Material assignment modal state
    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([])

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

    const columns = [
        { id: 'nowy', title: 'Nowy', color: 'bg-secondary' },
        { id: 'projektowanie', title: 'Projektowanie', color: 'bg-warning' },
        { id: 'cnc', title: 'Wycinanie CNC', color: 'bg-primary' },
        { id: 'montaz', title: 'Składanie (Produkcja)', color: 'bg-success' }
    ] as const

    const getColumnId = (t: Tile) => {
        switch (t.status) {
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
            laborCost: 0,
            bom: []
        }
        await addTile(newTile)
        showToast('Dodano element', 'success')
        setQaName('')
    }

    const handleTileEdit = (tile: Tile) => {
        setEditingTile(tile)
        setIsEditModalOpen(true)
    }

    const handleTileCreate = () => {
        setEditingTile(null)
        setIsEditModalOpen(true)
    }

    const handleModalClose = () => {
        setIsEditModalOpen(false)
        setEditingTile(null)
    }

    const handleTileSave = async (tileData: Omit<Tile, 'id'>) => {
        try {
            if (editingTile) {
                // Update existing tile
                onTileUpdate(editingTile.id, tileData)
            } else {
                // Create new tile
                const newTile: Tile = {
                    ...tileData,
                    id: crypto.randomUUID()
                }
                await addTile(newTile)
            }
            showToast(editingTile ? 'Element zaktualizowany' : 'Element utworzony', 'success')
            handleModalClose()
        } catch {
            showToast('Błąd podczas zapisywania elementu', 'danger')
        }
    }

    return (
        <div>
            {/* DEBUG INFO - Remove after fixing */}
            {projectTiles.length === 0 && (
                <Card style={{ marginBottom: 16, borderColor: '#ff6b35' }}>
                    <div style={{ color: '#ff6b35', fontWeight: 600, marginBottom: 8 }}>
                        🔧 DEBUG: Brak elementów w tym projekcie
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        <div>ID Projektu: <code>{project.id}</code></div>
                        <div>Nazwa Projektu: <code>{project.name}</code></div>
                        <div>Liczba wszystkich elementów: <code>{projectTiles.length}</code></div>
                        <div>Czy jest moduł 'projektowanie_techniczne': <code>{project.modules?.includes('projektowanie_techniczne') ? 'TAK' : 'NIE'}</code></div>
                        <div>Dostępne moduły: <code>{project.modules?.join(', ') || 'BRAK'}</code></div>
                    </div>
                </Card>
            )}

            {/* Header + Quick Add */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Elementy Projektu</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Kanban na górze, grupy poniżej</div>
                </div>
                <Space>
                    <Button type="primary" size="small" onClick={onCreateGroup} aria-label="Stwórz nową grupę">
                        <i className="ri-add-circle-line" style={{ marginRight: 4 }}></i>Stwórz grupę
                    </Button>
                    {project.modules?.includes('produkcja') && onPushToProduction && (
                        <Button size="small" onClick={onPushToProduction} aria-label="Wyślij elementy do produkcji">
                            <i className="ri-send-plane-line" style={{ marginRight: 4 }}></i>Wyślij do produkcji
                        </Button>
                    )}
                </Space>
            </div>

            {/* Quick Add Bar */}
            <Card style={{ marginBottom: 12 }}>
                <Form layout="vertical" onFinish={handleQuickAdd}>
                    <Row gutter={[8, 8]} align="bottom">
                        <Col xs={24} md={10}>
                            <Form.Item label="Nazwa elementu *" required>
                                <Input placeholder="np. Panel frontowy" value={qaName} onChange={e => setQaName(e.currentTarget.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                        </Col>
                        <Col xs={24} md={4}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                <i className="ri-add-line" style={{ marginRight: 4 }}></i>Dodaj
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
                        Potrzebujesz więcej pól? Użyj edytora zaawansowanego
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4, verticalAlign: 'baseline' }} onClick={handleTileCreate}>Otwórz edytor</Button>
                    </div>
                </Form>
            </Card>

            <Tabs
                items={(() => {
                    const items = [
                        {
                            key: 'kanban',
                            label: 'Kanban',
                            children: (
                                <div style={{ marginBottom: 16 }}>
                                    <Row gutter={[16, 16]}>
                                        {columns.map(column => {
                                            const columnTiles = projectTiles.filter(tile => getColumnId(tile) === column.id)
                                            return (
                                                <Col key={column.id} xs={24} sm={12} lg={6}>
                                                    <Card
                                                        title={
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span>{column.title}</span>
                                                                <span style={{
                                                                    backgroundColor: column.color === 'bg-secondary' ? '#6c757d' :
                                                                        column.color === 'bg-warning' ? '#ffc107' :
                                                                            column.color === 'bg-primary' ? '#007bff' : '#28a745',
                                                                    color: 'white',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '12px',
                                                                    fontSize: '12px'
                                                                }}>
                                                                    {columnTiles.length}
                                                                </span>
                                                            </div>
                                                        }
                                                        size="small"
                                                        style={{ height: '100%' }}
                                                        headStyle={{
                                                            backgroundColor: column.color === 'bg-secondary' ? '#6c757d' :
                                                                column.color === 'bg-warning' ? '#ffc107' :
                                                                    column.color === 'bg-primary' ? '#007bff' : '#28a745',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <div style={{ minHeight: 200 }}>
                                                            {columnTiles.map(tile => (
                                                                <div key={tile.id} style={{ marginBottom: 8 }}>
                                                                    <TileCard
                                                                        tile={tile}
                                                                        onEdit={() => handleTileEdit(tile)}
                                                                    />
                                                                </div>
                                                            ))}
                                                            {columnTiles.length === 0 && (
                                                                <div style={{
                                                                    textAlign: 'center',
                                                                    color: '#999',
                                                                    padding: 20,
                                                                    fontSize: 12
                                                                }}>
                                                                    Brak elementów
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </div>
                            )
                        }]
                    if (project.modules?.includes('projektowanie')) {
                        items.push({
                            key: 'model3d',
                            label: 'Model 3D',
                            children: (
                                <Card style={{ marginBottom: 16 }}>
                                    <Form
                                        layout="vertical"
                                        onFinish={async () => {
                                            try {
                                                await updateProjectModel(project.id, modelUrl.trim())
                                                message.success('Zapisano link do modelu 3D')
                                            } catch {
                                                message.error('Nie udało się zapisać linku')
                                            }
                                        }}
                                    >
                                        <Row gutter={12} align="bottom">
                                            <Col xs={24} md={18}>
                                                <Form.Item label="Link do modelu 3D (Speckle)" required>
                                                    <Input
                                                        placeholder="https://speckle.xyz/streams/..."
                                                        value={modelUrl}
                                                        onChange={e => setModelUrl(e.currentTarget.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                                    Zapisz link
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>

                                    <div style={{ marginTop: 12 }}>
                                        <SpeckleViewer
                                            initialStreamUrl={modelUrl || project.link_model_3d}
                                            height={520}
                                            enableSelection
                                            onSelectionChange={(ids: string[]) => {
                                                setSelectedObjectIds(ids);
                                                // Store in global for backward compatibility
                                                (window as any).__speckleSelection = ids;
                                            }}
                                        />
                                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                            <Button
                                                type="primary"
                                                disabled={selectedObjectIds.length === 0}
                                                onClick={() => {
                                                    if (selectedObjectIds.length === 0) {
                                                        message.warning('Zaznacz obiekty w modelu 3D')
                                                        return
                                                    }
                                                    // Open tile modal prefilled
                                                    setEditingTile({
                                                        id: crypto.randomUUID(),
                                                        name: 'Nowy element z selekcji',
                                                        status: 'W KOLEJCE',
                                                        project: project.id,
                                                        speckle_object_ids: selectedObjectIds,
                                                        bom: []
                                                    } as any)
                                                    setIsEditModalOpen(true)
                                                }}
                                            >
                                                Utwórz Kafelek z Zaznaczenia ({selectedObjectIds.length})
                                            </Button>
                                            <Button
                                                disabled={selectedObjectIds.length === 0}
                                                onClick={async () => {
                                                    if (selectedObjectIds.length === 0) {
                                                        message.warning('Zaznacz obiekty w modelu 3D')
                                                        return
                                                    }
                                                    try {
                                                        const created = await createTileFromSelection(project.id, selectedObjectIds, `SELECTION-${selectedObjectIds.length}`)
                                                        if (created) {
                                                            showToast('Utworzono element z selekcji', 'success')
                                                            await useTilesStore.getState().refresh()
                                                            showNotification('Element utworzony', `#${created.id} – kliknij Cofnij, aby usunąć`, 'info')
                                                        } else {
                                                            message.error('Nie udało się utworzyć elementu')
                                                        }
                                                    } catch {
                                                        message.error('Błąd tworzenia elementu z selekcji')
                                                    }
                                                }}
                                            >
                                                Szybkie utwórz
                                            </Button>
                                            <Button
                                                disabled={selectedObjectIds.length === 0}
                                                onClick={() => {
                                                    if (selectedObjectIds.length === 0) {
                                                        message.warning('Zaznacz obiekty w modelu 3D')
                                                        return
                                                    }
                                                    message.info('Funkcja przypisywania materiałów będzie dostępna wkrótce')
                                                }}
                                            >
                                                Przypisz materiał ({selectedObjectIds.length})
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })
                    }
                    return items
                })()}
            />

            {/* Groups below */}
            <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Grupy</div>
                    <Button size="small" onClick={onCreateGroup} aria-label="Utwórz nową grupę">
                        <i className="ri-folder-add-line" style={{ marginRight: 4 }}></i>Nowa grupa
                    </Button>
                </div>
                <GroupView
                    groups={groups}
                    onTileClick={onTileClick}
                />
            </div>

            {/* Modal edycji kafelków */}
            <TileEditDrawer
                open={isEditModalOpen}
                onClose={handleModalClose}
                onSave={handleTileSave}
                tile={editingTile || undefined}
                projectId={project.id}
            />

            {/* Modal przypisywania materiałów */}
        </div>
    )
}
