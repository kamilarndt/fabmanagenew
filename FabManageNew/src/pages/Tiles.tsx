import { useEffect, useMemo, useState } from 'react'
import { Button, Space, message, Row, Col, Card, Input, Select, Typography } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useTilesStore } from '../stores/tilesStore'
import { useAuthStore } from '../stores/authStore'
import { useProjectsStore } from '../stores/projectsStore'
import type { Tile } from '../types/tiles.types'
import TileCard from '../components/Tiles/TileCard'
import TileEditModalV3 from '../components/Tiles/TileEditModalV3'
import { PageHeader } from '../components/Ui/PageHeader'

const { Search } = Input
const { Title } = Typography

export default function TilesPage() {
    const { tiles, initialize, addTile, updateTile, refresh } = useTilesStore()
    const { projects } = useProjectsStore()
    const { roles } = useAuthStore()
    const canManage = roles.includes('manager')
    const canDesign = roles.includes('designer') || canManage

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('All')
    const [projectFilter, setProjectFilter] = useState<string>('All')

    useEffect(() => { initialize() }, [initialize])

    const filteredTiles = useMemo(() => {
        return tiles.filter(tile => {
            const matchesSearch = tile.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'All' || tile.status === statusFilter
            const matchesProject = projectFilter === 'All' || tile.project === projectFilter
            return matchesSearch && matchesStatus && matchesProject
        })
    }, [tiles, searchQuery, statusFilter, projectFilter])

    const handleEdit = (tile: Tile) => {
        setEditingTile(tile)
        setEditModalOpen(true)
    }

    const handleView = (tile: Tile) => {
        // Navigate to tile details or open in drawer
        console.log('View tile:', tile)
    }

    const handleAssign = (tile: Tile) => {
        // Open assign designer modal
        console.log('Assign tile:', tile)
    }

    const handleSaveTile = async (tileData: Omit<Tile, 'id'>) => {
        try {
            if (editingTile) {
                await updateTile(editingTile.id, tileData)
                message.success('Kafelek zaktualizowany')
            } else {
                await addTile({ ...tileData, id: crypto.randomUUID() })
                message.success('Kafelek dodany')
            }
            setEditModalOpen(false)
            setEditingTile(null)
        } catch (_error) {
            message.error('Błąd podczas zapisywania kafelka')
        }
    }

    const handleAddNew = () => {
        setEditingTile(null)
        setEditModalOpen(true)
    }

    return (
        <div className="container-fluid py-3">
            <PageHeader
                title="Elementy (Kafelki)"
                subtitle="Wizualny inwentarz wszystkich komponentów projektu"
            />

            {/* Filtry i wyszukiwanie */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Szukaj kafelków..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            placeholder="Status"
                        >
                            <Select.Option value="All">Wszystkie statusy</Select.Option>
                            <Select.Option value="W KOLEJCE">W kolejce</Select.Option>
                            <Select.Option value="Projektowanie">Projektowanie</Select.Option>
                            <Select.Option value="W trakcie projektowania">W trakcie projektowania</Select.Option>
                            <Select.Option value="Do akceptacji">Do akceptacji</Select.Option>
                            <Select.Option value="Zaakceptowane">Zaakceptowane</Select.Option>
                            <Select.Option value="W TRAKCIE CIĘCIA">W trakcie cięcia</Select.Option>
                            <Select.Option value="W produkcji CNC">W produkcji CNC</Select.Option>
                            <Select.Option value="WYCIĘTE">Wycięte</Select.Option>
                            <Select.Option value="Gotowy do montażu">Gotowy do montażu</Select.Option>
                            <Select.Option value="Zakończony">Zakończony</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            value={projectFilter}
                            onChange={setProjectFilter}
                            style={{ width: '100%' }}
                            placeholder="Projekt"
                        >
                            <Select.Option value="All">Wszystkie projekty</Select.Option>
                            {projects.map(project => (
                                <Select.Option key={project.id} value={project.id}>
                                    {project.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddNew}
                                disabled={!canDesign}
                            >
                                Dodaj Nowy Kafelek
                            </Button>
                            <Button onClick={refresh}>
                                Odśwież
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Statystyki */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                                {filteredTiles.length}
                            </Title>
                            <div>Wszystkich kafelków</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                                {filteredTiles.filter(t => (t.status as any) === 'Zakończony').length}
                            </Title>
                            <div>Zakończonych</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#faad14' }}>
                                {filteredTiles.filter(t => t.status === 'W trakcie projektowania' || t.status === 'Projektowanie').length}
                            </Title>
                            <div>W projektowaniu</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#f5222d' }}>
                                {filteredTiles.filter(t => t.status === 'Wymagają poprawek').length}
                            </Title>
                            <div>Wymagają poprawek</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Kafelki */}
            <Row gutter={[16, 16]}>
                {filteredTiles.map(tile => (
                    <Col key={tile.id} xs={24} sm={12} lg={8} xl={6}>
                        <TileCard
                            tile={tile}
                            onEdit={handleEdit}
                            onView={handleView}
                            onAssign={handleAssign}
                        />
                    </Col>
                ))}
            </Row>

            {filteredTiles.length === 0 && (
                <Card style={{ textAlign: 'center', padding: 40 }}>
                    <Title level={4} type="secondary">Brak kafelków</Title>
                    <p>Nie znaleziono kafelków spełniających kryteria wyszukiwania.</p>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                        Dodaj pierwszy kafelek
                    </Button>
                </Card>
            )}

            {/* Modal edycji */}
            <TileEditModalV3
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setEditingTile(null)
                }}
                onSave={handleSaveTile}
                tile={editingTile || undefined}
            />
        </div>
    )
}