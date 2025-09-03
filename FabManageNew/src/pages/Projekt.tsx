import { useMemo, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { showToast } from '../lib/toast'
import { useTilesStore, type Tile } from '../stores/tilesStore'
import type { Project } from '../types/projects.types'
import TileEditModal from '../components/TileEditModal'
import EditProjectModal from '../components/EditProjectModal'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// New modular components
import ProjectHeader from '../components/Project/ProjectHeader'
import ProjectTabs from '../components/Project/ProjectTabs'
import ProjectOverview from '../components/Project/ProjectOverview'
import ProjectElements from '../components/Project/ProjectElements'
import ProjectMaterials from '../components/Project/ProjectMaterials'
import AddMemberModal from '../components/Modals/AddMemberModal'
import CreateGroupModal from '../components/Groups/CreateGroupModal'

// Hooks
import { useProjectData } from '../hooks/useProjectData'

// Import existing modules
import { Suspense } from 'react';
import ConceptBoard from '../modules/Concept/ConceptBoard'
import EstimateBuilder from '../modules/Estimate/EstimateBuilder'

import LogisticsTab from '../modules/Logistics/LogisticsTab'
import AccommodationTab from '../modules/Accommodation/AccommodationTab'
import { StageStepper } from '../components/Ui/StageStepper'



interface ProjectDocument {
    id: string
    name: string
    type: string
    uploadedBy: string
    uploadedAt: string
    size: string
}

interface ProjectComment {
    id: string
    author: string
    content: string
    timestamp: string
    avatar: string
}

interface TeamMember {
    id: string
    name: string
    role: string
    avatar: string
    workload: number
}

export default function Projekt() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { projects, update } = useProjectsStore()
    const { tiles, updateTile, addTile } = useTilesStore()
    const [activeTab, setActiveTab] = useState<'overview' | 'elementy' | 'zakupy' | 'koncepcja' | 'wycena' | 'logistyka' | 'zakwaterowanie'>('overview')
    const [showTileModal, setShowTileModal] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)
    const [showCreateGroup, setShowCreateGroup] = useState(false)
    const [showEditProject, setShowEditProject] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)

    const project = useMemo(() => projects.find(p => p.id === id), [projects, id])

    // Move all hooks before conditional return
    const safeProject: Project = project ?? {
        id: 'unknown',
        name: 'Unknown',
        clientId: '',
        client: '',
        status: 'Active',
        deadline: '',
        groups: [],
        modules: []
    }
    const {
        projectTiles,
        tileCosts,
        purchaseList,
    } = useProjectData(safeProject, tiles)

    const handleAddComment = useCallback(() => {
        showToast('Komentarz dodany', 'success')
        // TODO: Add comment to store
    }, [])

    const handleTileUpdate = useCallback(async (tileId: string, updates: Partial<Tile>) => {
        try {
            await updateTile(tileId, updates)
            showToast('Kafelek zaktualizowany', 'success')
        } catch {
            showToast('Błąd podczas aktualizacji kafelka', 'danger')
        }
    }, [updateTile])

    const handleTileClick = useCallback((tile: Tile) => {
        setEditingTile(tile)
        setShowTileModal(true)
    }, [])

    const handleAddTile = useCallback(() => {
        setEditingTile(null)
        setShowTileModal(true)
    }, [])

    const handleSaveTile = useCallback(async (tileData: Partial<Tile>) => {
        try {
            if (editingTile) {
                await updateTile(editingTile.id, tileData)
                showToast('Kafelek zaktualizowany', 'success')
            } else {
                const newTile: Tile = {
                    id: crypto.randomUUID(),
                    name: tileData.name || 'Nowy kafelek',
                    status: 'W KOLEJCE',
                    project: project?.id || '',
                    priority: tileData.priority || 'Średni',
                    technology: tileData.technology || 'Frezowanie CNC',
                    laborCost: tileData.laborCost || 0,
                    bom: tileData.bom || []
                }
                await addTile(newTile)
                showToast('Kafelek dodany', 'success')
            }
            setShowTileModal(false)
            setEditingTile(null)
        } catch {
            showToast('Błąd podczas zapisywania kafelka', 'danger')
        }
    }, [editingTile, updateTile, addTile, project?.id])

    const handleCreateGroup = useCallback((groupData: {
        name: string
        description?: string
        thumbnail?: string
        files: { id: string; name: string; url: string; type: string }[]
    }) => {
        const newGroup = {
            id: crypto.randomUUID(),
            name: groupData.name,
            description: groupData.description,
            thumbnail: groupData.thumbnail,
            files: groupData.files
        }

        const currentGroups = project?.groups || []
        update(project?.id || '', { groups: [...currentGroups, newGroup] })
        showToast('Grupa utworzona', 'success')
        setShowCreateGroup(false)
    }, [project?.groups, project?.id, update])

    const handlePushToProduction = useCallback(() => {
        // TODO: Implement push to production logic
        showToast('Elementy wysłane do produkcji', 'success')
    }, [])

    const handleAddMembers = useCallback((memberIds: string[]) => {
        // TODO: Implement add members logic
        showToast(`Dodano ${memberIds.length} członków`, 'success')
    }, [])

    if (!project) {
        return (
            <div className="text-center mt-5">
                <h4>Projekt nie znaleziony</h4>
                <p className="text-muted mb-3">Projekt o ID "{id}" nie istnieje lub został usunięty.</p>
                <button className="btn btn-primary" onClick={() => navigate('/projekty')}>
                    <i className="ri-arrow-left-line me-1"></i>Powrót do projektów
                </button>
            </div>
        )
    }

    // Mock data - will be replaced with real data from stores
    const teamMembers: TeamMember[] = [
        { id: 'member-1', name: 'Anna Kowalska', role: 'Project Manager', avatar: 'https://i.pravatar.cc/40?img=1', workload: 85 },
        { id: 'member-2', name: 'Paweł Nowak', role: 'Designer', avatar: 'https://i.pravatar.cc/40?img=2', workload: 70 },
        { id: 'member-3', name: 'Marek Wójcik', role: 'CNC Operator', avatar: 'https://i.pravatar.cc/40?img=3', workload: 45 },
        { id: 'member-4', name: 'Tomasz Kowal', role: 'Assembly Technician', avatar: 'https://i.pravatar.cc/40?img=4', workload: 30 },
        { id: 'member-5', name: 'Maria Lis', role: 'Quality Control', avatar: 'https://i.pravatar.cc/40?img=5', workload: 55 }
    ]

    const comments: ProjectComment[] = [
        {
            id: 'comment-1',
            author: 'Anna Kowalska',
            content: 'Wymagania zostały zatwierdzone przez klienta. Możemy przejść do fazy projektowania.',
            timestamp: '2025-01-05 15:30',
            avatar: 'https://i.pravatar.cc/32?img=1'
        },
        {
            id: 'comment-2',
            author: 'Paweł Nowak',
            content: 'Pierwsza wersja rysunków gotowa. Proszę o weryfikację wymiarów panelu głównego.',
            timestamp: '2025-01-08 11:45',
            avatar: 'https://i.pravatar.cc/32?img=2'
        }
    ]

    const documents: ProjectDocument[] = [
        {
            id: 'doc-1',
            name: 'Specyfikacja techniczna.pdf',
            type: 'PDF',
            uploadedBy: 'Anna Kowalska',
            uploadedAt: '2025-01-01 10:30',
            size: '2.4 MB'
        },
        {
            id: 'doc-2',
            name: 'Rysunek konstrukcyjny.dwg',
            type: 'DWG',
            uploadedBy: 'Paweł Nowak',
            uploadedAt: '2025-01-08 14:15',
            size: '1.8 MB'
        }
    ]

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                {/* Project Header */}
                <ProjectHeader
                    project={project}
                    teamMembers={teamMembers}
                    onEditProject={() => setShowEditProject(true)}
                    onAddMember={() => setShowAddMember(true)}
                />

                {/* Project Tabs */}
                <ProjectTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    project={project}
                />

                {/* Tab Content */}
                <div className="card-body">
                    <div className="mb-3">
                        <StageStepper
                            steps={[
                                { key: 'overview', label: 'Przegląd' },
                                { key: 'elementy', label: 'Elementy' },
                                { key: 'zakupy', label: 'Materiały' },
                                { key: 'koncepcja', label: 'Koncepcja' },
                                { key: 'wycena', label: 'Wycena' },
                                { key: 'logistyka', label: 'Logistyka' },
                                { key: 'zakwaterowanie', label: 'Zakwater.' },
                            ]}
                            currentKey={activeTab}
                        />
                    </div>
                    {activeTab === 'overview' && (
                        <ProjectOverview
                            project={project}
                            comments={comments}
                            documents={documents}
                            teamMembers={teamMembers}
                            onAddComment={handleAddComment}
                        />
                    )}

                    {activeTab === 'elementy' && (
                        <ProjectElements
                            project={project}
                            projectTiles={projectTiles}
                            tileCosts={tileCosts}
                            onTileUpdate={handleTileUpdate}
                            onTileClick={handleTileClick}
                            onAddTile={handleAddTile}
                            onCreateGroup={() => setShowCreateGroup(true)}
                            onPushToProduction={project.modules?.includes('produkcja') ? handlePushToProduction : undefined}
                        />
                    )}

                    {activeTab === 'zakupy' && (
                        <ProjectMaterials purchaseList={purchaseList} />
                    )}

                    {activeTab === 'koncepcja' && project.modules?.includes('koncepcja') && (
                        <Suspense fallback={<div>Loading...</div>}>
                            <ConceptBoard projectId={project.id} />
                        </Suspense>
                    )}

                    {activeTab === 'wycena' && (
                        <Suspense fallback={<div>Loading...</div>}>
                            <EstimateBuilder />
                        </Suspense>
                    )}

                    {activeTab === 'logistyka' && (
                        <Suspense fallback={<div>Loading...</div>}>
                            <LogisticsTab projectId={project.id} />
                        </Suspense>
                    )}

                    {activeTab === 'zakwaterowanie' && (
                        <Suspense fallback={<div>Loading...</div>}>
                            <AccommodationTab projectId={project.id} />
                        </Suspense>
                    )}
                </div>

                {/* Modals */}
                {showTileModal && (
                    <TileEditModal
                        tile={editingTile || {
                            id: 'new',
                            name: '',
                            status: 'W KOLEJCE',
                            project: project.id,
                            priority: 'Średni',
                            technology: 'Frezowanie CNC',
                            laborCost: 0,
                            bom: []
                        }}
                        onClose={() => setShowTileModal(false)}
                        onSave={handleSaveTile}
                    />
                )}

                <AddMemberModal
                    isOpen={showAddMember}
                    onClose={() => setShowAddMember(false)}
                    teamMembers={teamMembers}
                    onAddMembers={handleAddMembers}
                />

                <CreateGroupModal
                    isOpen={showCreateGroup}
                    onClose={() => setShowCreateGroup(false)}
                    onCreateGroup={handleCreateGroup}
                />

                {showEditProject && (
                    <EditProjectModal
                        open={showEditProject}
                        projectId={project.id}
                        onClose={() => setShowEditProject(false)}
                    />
                )}
            </div>
        </DndProvider>
    )
}



