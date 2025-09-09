import { useState, useMemo } from 'react'
import type { Tile } from '../../types/tiles.types'
import type { Project } from '../../types/projects.types'
import GroupView from '../Groups/GroupView'
import { useTilesStore } from '../../stores/tilesStore'
import { showToast } from '../../lib/notifications'
import { Card, Form, Input, Button, Space, Row, Col } from 'antd'
import TileCard from '../Tiles/TileCard'
import TileEditModal from '../Tiles/TileEditModal'

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

    // Quick add state
    const [qaName, setQaName] = useState('')

    // Tile edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)

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
        } catch (error) {
            showToast('Błąd podczas zapisywania elementu', 'danger')
        }
    }

    return (
        <div>
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

            {/* Kanban z nowymi kartami */}
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
            <TileEditModal
                open={isEditModalOpen}
                onClose={handleModalClose}
                onSave={handleTileSave}
                tile={editingTile || undefined}
                projectId={project.id}
            />
        </div>
    )
}
