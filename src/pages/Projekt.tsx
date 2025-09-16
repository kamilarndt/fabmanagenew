import { Button, Card, Result } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TileEditDrawer from "../components/Tiles/tile-edit-drawer";
import { showToast } from "../lib/notifications";
import EditProjectModal from "../modules/projects/components/EditProjectModal";
import { useProjectsStore } from "../stores/projectsStore";
import { useTilesStore, type Tile } from "../stores/tilesStore";
import type { Project } from "../types/projects.types";

// New modular components
import CreateGroupModal from "../components/Groups/CreateGroupModal";
import AddMemberModal from "../components/Modals/AddMemberModal";
import SelectSpeckleModelModal from "../components/Modals/SelectSpeckleModelModal";
import ProjectElements from "../modules/projects/components/ProjectElements";
import ProjectHeader from "../modules/projects/components/ProjectHeader";
import ProjectMaterials from "../modules/projects/components/ProjectMaterials";
import ProjectOverview from "../modules/projects/components/ProjectOverview";
import ProjectTabs, {
  type TabId,
} from "../modules/projects/components/ProjectTabs";

// Hooks
import { useProjectData } from "../hooks/useProjectData";

// Lazy load heavy modules
import { Suspense, lazy } from "react";
import { StageStepper } from "../components/Ui/StageStepper";
import { ModuleLoading } from "../components/ui/LoadingSpinner";
const ConceptBoard = lazy(() => import("../modules/Concept/ConceptBoard"));
const EstimateModule = lazy(
  () => import("../components/Estimate/EstimateModule")
);
const LogisticsTab = lazy(() => import("../modules/Logistics/LogisticsTab"));
const AccommodationTab = lazy(
  () => import("../modules/Accommodation/AccommodationTab")
);
// import GanttChart from '../components/Gantt/GanttChart' // Unused for now
import ProjectGanttChart from "../components/Gantt/ProjectGanttChart";
import LazySpeckleViewer from "../components/LazySpeckleViewer";

interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

interface ProjectComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  workload: number;
}

export default function Projekt() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, update } = useProjectsStore();
  const { tiles, updateTile, addTile } = useTilesStore();
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") as TabId | null;
    return tab &&
      [
        "overview",
        "koncepcja",
        "wycena",
        "elementy",
        "zakupy",
        "logistyka",
        "zakwaterowanie",
        "harmonogram",
        "model_3d",
      ].includes(tab)
      ? tab
      : "overview";
  });
  const [showTileModal, setShowTileModal] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSelectModel, setShowSelectModel] = useState(false);

  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );
  // Define safeProject before any usage
  const safeProject = (project ?? {
    id: "unknown",
    numer: "P-2025/01/UNK",
    name: "Unknown",
    typ: "Event" as any,
    lokalizacja: "Nieznana",
    clientId: "",
    client: "",
    status: "new" as any,
    data_utworzenia: new Date().toISOString().slice(0, 10),
    deadline: "",
    postep: 0,
    groups: [],
    modules: [],
  }) as Project;
  // const { getProjectDataForGantt } = useProjectsStore() // Unused for now
  // Ensure tiles are initialized for the project (in case not yet)
  const { initialize: initTiles } = useTilesStore();
  useEffect(() => {
    if (tiles.length === 0) {
      initTiles().catch(() => {});
    }
  }, [tiles.length, initTiles]);
  // const [ganttView, setGanttView] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week') // Unused for now
  // const ganttTasks = useMemo(() => {
  //     // Prefer pure helper to avoid circular store deps
  //     try {
  //         return buildGanttTasks(project, tiles)
  //     } catch {
  //         // fallback to existing selector (project & groups only)
  //         return getProjectDataForGantt(safeProject.id)
  //     }
  // }, [project, tiles, getProjectDataForGantt, safeProject.id]) // Unused for now
  const { projectTiles, tileCosts, purchaseList } = useProjectData(
    safeProject,
    tiles
  );

  const handleAddComment = useCallback(() => {
    showToast("Komentarz dodany", "success");
    // TODO: Add comment to store
  }, []);

  const handleTileUpdate = useCallback(
    async (tileId: string, updates: Partial<Tile>) => {
      try {
        await updateTile(tileId, updates);
        showToast("Kafelek zaktualizowany", "success");
      } catch {
        showToast("Błąd podczas aktualizacji kafelka", "danger");
      }
    },
    [updateTile]
  );

  const handleTileClick = useCallback((tile: Tile) => {
    setEditingTile(tile);
    setShowTileModal(true);
  }, []);

  const handleAddTile = useCallback(() => {
    setEditingTile(null);
    setShowTileModal(true);
  }, []);

  const handleSaveTile = useCallback(
    async (tileData: Omit<Tile, "id">) => {
      try {
        if (editingTile) {
          await updateTile(editingTile.id, tileData);
          showToast("Kafelek zaktualizowany", "success");
        } else {
          const newTile: Tile = {
            ...tileData,
            id: crypto.randomUUID(),
            status: tileData.status || "W KOLEJCE",
            project: tileData.project || project?.id || "",
          };
          await addTile(newTile);
          showToast("Kafelek dodany", "success");
        }
        setShowTileModal(false);
        setEditingTile(null);
      } catch {
        showToast("Błąd podczas zapisywania kafelka", "danger");
      }
    },
    [editingTile, updateTile, addTile, project?.id]
  );

  const handleCreateGroup = useCallback(
    (groupData: {
      name: string;
      description?: string;
      thumbnail?: string;
      files: { id: string; name: string; url: string; type: string }[];
    }) => {
      const newGroup = {
        id: crypto.randomUUID(),
        name: groupData.name,
        description: groupData.description,
        thumbnail: groupData.thumbnail,
        files: groupData.files,
      };

      const currentGroups = project?.groups || [];
      update(project?.id || "", { groups: [...currentGroups, newGroup] });
      showToast("Grupa utworzona", "success");
      setShowCreateGroup(false);
    },
    [project?.groups, project?.id, update]
  );

  const handlePushToProduction = useCallback(() => {
    // TODO: Implement push to production logic
    showToast("Elementy wysłane do produkcji", "success");
  }, []);

  const handleAddMembers = useCallback((memberIds: string[]) => {
    // TODO: Implement add members logic
    showToast(`Dodano ${memberIds.length} członków`, "success");
  }, []);

  if (!project) {
    return (
      <Result
        status="404"
        title="Projekt nie znaleziony"
        subTitle={`Projekt o ID "${id}" nie istnieje lub został usunięty.`}
        extra={
          <Button type="primary" onClick={() => navigate("/projekty")}>
            Powrót do projektów
          </Button>
        }
      />
    );
  }

  // Mock data - will be replaced with real data from stores
  const teamMembers: TeamMember[] = [
    {
      id: "member-1",
      name: "Anna Kowalska",
      role: "Project Manager",
      avatar: "https://i.pravatar.cc/40?img=1",
      workload: 85,
    },
    {
      id: "member-2",
      name: "Paweł Nowak",
      role: "Designer",
      avatar: "https://i.pravatar.cc/40?img=2",
      workload: 70,
    },
    {
      id: "member-3",
      name: "Marek Wójcik",
      role: "CNC Operator",
      avatar: "https://i.pravatar.cc/40?img=3",
      workload: 45,
    },
    {
      id: "member-4",
      name: "Tomasz Kowal",
      role: "Assembly Technician",
      avatar: "https://i.pravatar.cc/40?img=4",
      workload: 30,
    },
    {
      id: "member-5",
      name: "Maria Lis",
      role: "Quality Control",
      avatar: "https://i.pravatar.cc/40?img=5",
      workload: 55,
    },
  ];

  const comments: ProjectComment[] = [
    {
      id: "comment-1",
      author: "Anna Kowalska",
      content:
        "Wymagania zostały zatwierdzone przez klienta. Możemy przejść do fazy projektowania.",
      timestamp: "2025-01-05 15:30",
      avatar: "https://i.pravatar.cc/32?img=1",
    },
    {
      id: "comment-2",
      author: "Paweł Nowak",
      content:
        "Pierwsza wersja rysunków gotowa. Proszę o weryfikację wymiarów panelu głównego.",
      timestamp: "2025-01-08 11:45",
      avatar: "https://i.pravatar.cc/32?img=2",
    },
  ];

  const documents: ProjectDocument[] = [
    {
      id: "doc-1",
      name: "Specyfikacja techniczna.pdf",
      type: "PDF",
      uploadedBy: "Anna Kowalska",
      uploadedAt: "2025-01-01 10:30",
      size: "2.4 MB",
    },
    {
      id: "doc-2",
      name: "Rysunek konstrukcyjny.dwg",
      type: "DWG",
      uploadedBy: "Paweł Nowak",
      uploadedAt: "2025-01-08 14:15",
      size: "1.8 MB",
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {/* Project Header */}
        <ProjectHeader
          project={{
            ...project,
            priority: "medium",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: project.status === "done" ? "completed" : project.status,
            modules: [],
          }}
          teamMembers={teamMembers}
          onEditProject={() => setShowEditProject(true)}
          onAddMember={() => setShowAddMember(true)}
        />

        {/* Project Tabs */}
        <ProjectTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          project={{
            ...project,
            priority: "medium",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: project.status === "done" ? "completed" : project.status,
            modules: [],
          }}
        />

        {/* Tab Content */}
        <div>
          <Card style={{ marginBottom: 12 }}>
            <StageStepper
              steps={[
                { key: "overview", label: "Przegląd" },
                { key: "elementy", label: "Elementy" },
                { key: "zakupy", label: "Materiały" },
                { key: "koncepcja", label: "Koncepcja" },
                { key: "wycena", label: "Wycena" },
                { key: "logistyka", label: "Logistyka" },
                { key: "zakwaterowanie", label: "Zakwater." },
              ]}
              currentKey={activeTab}
            />
          </Card>
          {activeTab === "overview" && (
            <ProjectOverview
              project={{
                ...project,
                priority: "medium",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status:
                  project.status === "done" ? "completed" : project.status,
                modules: [],
              }}
              comments={comments}
              documents={documents}
              teamMembers={teamMembers}
              onAddComment={handleAddComment}
            />
          )}

          {activeTab === "elementy" && (
            <ProjectElements
              project={{
                ...project,
                priority: "medium",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status:
                  project.status === "done" ? "completed" : project.status,
                modules: [],
              }}
              projectTiles={projectTiles}
              tileCosts={tileCosts}
              onTileUpdate={handleTileUpdate}
              onTileClick={handleTileClick}
              onAddTile={handleAddTile}
              onCreateGroup={() => setShowCreateGroup(true)}
              onPushToProduction={
                project.modules?.includes("produkcja")
                  ? handlePushToProduction
                  : undefined
              }
            />
          )}

          {activeTab === "zakupy" && (
            <ProjectMaterials
              purchaseList={purchaseList}
              projectId={project.id}
            />
          )}

          {activeTab === "koncepcja" &&
            project.modules?.includes("koncepcja") && (
              <Suspense fallback={<ModuleLoading />}>
                <ConceptBoard projectId={project.id} />
              </Suspense>
            )}

          {activeTab === "wycena" && (
            <Suspense fallback={<ModuleLoading />}>
              <EstimateModule project={project} />
            </Suspense>
          )}

          {activeTab === "logistyka" && (
            <Suspense fallback={<ModuleLoading />}>
              <LogisticsTab projectId={project.id} />
            </Suspense>
          )}

          {activeTab === "zakwaterowanie" && (
            <Suspense fallback={<ModuleLoading />}>
              <AccommodationTab projectId={project.id} />
            </Suspense>
          )}

          {activeTab === "model_3d" && (
            <Card>
              <h3>Model 3D Projektu</h3>
              {project.link_model_3d ? (
                <div>
                  <LazySpeckleViewer
                    initialStreamUrl={project.link_model_3d}
                    height={600}
                    enableSelection={false}
                    loadingText="Ładowanie modelu 3D projektu..."
                  />
                  <div style={{ textAlign: "right", marginTop: 12 }}>
                    <Button
                      type="default"
                      href={project.link_model_3d}
                      target="_blank"
                      icon={<i className="ri-external-link-line" />}
                    >
                      Otwórz w nowej karcie
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <i
                      className="ri-3d-view"
                      style={{ fontSize: "40px", color: "#ccc" }}
                    ></i>
                    <h4 style={{ color: "#999", marginTop: 12 }}>
                      Brak przypiętego modelu 3D
                    </h4>
                    <p style={{ color: "#999" }}>
                      Możesz otworzyć przeglądarkę Speckle i wybrać
                      strumień/commit.
                    </p>
                    <Button
                      type="primary"
                      onClick={() => setShowSelectModel(true)}
                    >
                      Wybierz z Speckle
                    </Button>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {/* Zbiorczy model z elementów projektu (jeśli kafelki mają linki) */}
                    <LazySpeckleViewer
                      initialStreamUrl={
                        projectTiles
                          .map((t) => t.link_model_3d!)
                          .filter(Boolean)[0] || ""
                      }
                      height={500}
                      loadingText="Ładowanie modeli 3D elementów..."
                    />
                  </div>
                </div>
              )}
            </Card>
          )}
          <SelectSpeckleModelModal
            open={showSelectModel}
            onCancel={() => setShowSelectModel(false)}
            onSelect={async (url) => {
              try {
                const { useProjectsStore } = await import(
                  "../stores/projectsStore"
                );
                await useProjectsStore
                  .getState()
                  .updateProjectModel(safeProject.id, url);
                setShowSelectModel(false);
              } catch {
                showToast("Nie udało się zapisać linku modelu", "danger");
              }
            }}
          />

          {activeTab === "harmonogram" && (
            <ProjectGanttChart
              project={project}
              tasks={tiles.filter((t) => t.project === project.id)}
            />
          )}
        </div>

        {/* Modals */}
        <TileEditDrawer
          open={showTileModal}
          onClose={() => setShowTileModal(false)}
          onSave={handleSaveTile}
          tile={editingTile || undefined}
          projectId={project.id}
        />

        <AddMemberModal
          open={showAddMember}
          onCancel={() => setShowAddMember(false)}
          onOk={() => setShowAddMember(false)}
          onClose={() => setShowAddMember(false)}
          currentMemberIds={teamMembers.map((m) => m.id)}
          onAddMembers={handleAddMembers}
        />

        <CreateGroupModal
          open={showCreateGroup}
          onCancel={() => setShowCreateGroup(false)}
          onOk={() => setShowCreateGroup(false)}
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
  );
}
