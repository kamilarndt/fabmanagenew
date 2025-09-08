import { useState, useMemo } from 'react'
import type { Tile } from '../../types/tiles.types'
import type { Project } from '../../types/projects.types'
import { KanbanBoardGeneric } from '../Ui/KanbanBoardGeneric'
import GroupView from '../Groups/GroupView'
import { useTilesStore } from '../../stores/tilesStore'
import { showToast } from '../../lib/toast'
import { Card, Form, Input, Select, Button, Space, Row, Col } from 'antd'

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
                            <Form.Item label="Technologia wiodąca">
                                <Select
                                    value={qaTech}
                                    onChange={setQaTech as any}
                                    options={[
                                        { value: 'Frezowanie CNC', label: 'Frezowanie CNC' },
                                        { value: 'Cięcie laserowe', label: 'Cięcie laserowe' },
                                        { value: 'Druk 3D', label: 'Druk 3D' },
                                        { value: 'Gięcie blach', label: 'Gięcie blach' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item label="Priorytet">
                                <Select
                                    value={qaPriority}
                                    onChange={v => setQaPriority(v as any)}
                                    options={[
                                        { value: 'Wysoki', label: 'Wysoki' },
                                        { value: 'Średni', label: 'Średni' },
                                        { value: 'Niski', label: 'Niski' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                <i className="ri-add-line" style={{ marginRight: 4 }}></i>Dodaj
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
                        Potrzebujesz więcej pól? Użyj edytora zaawansowanego
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4, verticalAlign: 'baseline' }} onClick={onAddTile}>Otwórz edytor</Button>
                    </div>
                </Form>
            </Card>

            {/* Kanban */}
            <KanbanBoardGeneric
                tiles={projectTiles}
                columns={columns as any}
                getColumnId={getColumnId}
                onTileUpdate={onTileUpdate}
                onTileClick={onTileClick}
                tileCosts={tileCosts}
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
        </div>
    )
}
