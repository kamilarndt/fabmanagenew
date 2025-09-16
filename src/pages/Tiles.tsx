import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select, Typography, message } from "antd";
import {
  AppButton,
  AppCard,
  AppCol,
  AppRow,
  AppSelect,
  AppSpace,
} from "../components/ui";

import { useEffect, useMemo, useState } from "react";
import TileCard from "../components/Tiles/TileCard";
import TileEditDrawer from "../components/Tiles/tile-edit-drawer";
import { PageHeader } from "../components/shared/PageHeader";
import { useAuthStore } from "../stores/authStore";
import { useProjectsStore } from "../stores/projectsStore";
import { useTilesStore } from "../stores/tilesStore";
import type { Tile } from "../types/tiles.types";

const { Search } = Input;
const { Title } = Typography;

export default function TilesPage() {
  console.warn("🔧 TilesPage: Component rendering...");
  const { tiles, initialize, addTile, updateTile, refresh } = useTilesStore();
  console.warn("🔧 TilesPage: Tiles from store:", tiles.length);
  const { projects } = useProjectsStore();
  const { roles } = useAuthStore();
  const canManage = roles.includes("manager");
  const canDesign = roles.includes("designer") || canManage;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [projectFilter, setProjectFilter] = useState<string>("All");

  useEffect(() => {
    console.warn("🔧 TilesPage: useEffect triggered, calling initialize()");
    initialize();
  }, [initialize]);

  const filteredTiles = useMemo(() => {
    return tiles.filter((tile) => {
      const matchesSearch = tile.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || tile.status === statusFilter;
      const matchesProject =
        projectFilter === "All" || tile.project === projectFilter;
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [tiles, searchQuery, statusFilter, projectFilter]);

  const handleEdit = (tile: Tile) => {
    setEditingTile(tile);
    setEditModalOpen(true);
  };

  const handleView = (tile: Tile) => {
    // Navigate to tile details or open in drawer
    console.warn("TODO: View tile:", tile);
  };

  const handleAssign = (tile: Tile) => {
    // Open assign designer modal
    console.warn("TODO: Assign tile:", tile);
  };

  const handleSaveTile = async (tileData: Omit<Tile, "id">) => {
    try {
      if (editingTile) {
        await updateTile(editingTile.id, tileData);
        message.success("Kafelek zaktualizowany");
      } else {
        await addTile({ ...tileData, id: crypto.randomUUID() });
        message.success("Kafelek dodany");
      }
      setEditModalOpen(false);
      setEditingTile(null);
    } catch {
      message.error("Błąd podczas zapisywania kafelka");
    }
  };

  const handleAddNew = () => {
    setEditingTile(null);
    setEditModalOpen(true);
  };

  return (
    <div data-component="TilesPage" data-variant="grid" data-state="active">
      <PageHeader
        title="Elementy (Kafelki)"
        subtitle="Wizualny inwentarz wszystkich komponentów projektu"
      />

      {/* Filtry i wyszukiwanie */}
      <AppCard style={{ marginBottom: 16 }}>
        <AppRow gutter={16} align="middle">
          <AppCol xs={24} sm={12} md={8}>
            <Search
              placeholder="Szukaj kafelków..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </AppCol>
          <AppCol xs={24} sm={6} md={4}>
            <AppSelect
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              placeholder="Status"
            >
              <Select.Option value="All">Wszystkie statusy</Select.Option>
              <Select.Option value="W KOLEJCE">W kolejce</Select.Option>
              <Select.Option value="Projektowanie">Projektowanie</Select.Option>
              <Select.Option value="W trakcie projektowania">
                W trakcie projektowania
              </Select.Option>
              <Select.Option value="Do akceptacji">Do akceptacji</Select.Option>
              <Select.Option value="Zaakceptowane">Zaakceptowane</Select.Option>
              <Select.Option value="W TRAKCIE CIĘCIA">
                W trakcie cięcia
              </Select.Option>
              <Select.Option value="W produkcji CNC">
                W produkcji CNC
              </Select.Option>
              <Select.Option value="WYCIĘTE">Wycięte</Select.Option>
              <Select.Option value="Gotowy do montażu">
                Gotowy do montażu
              </Select.Option>
              <Select.Option value="Zakończony">Zakończony</Select.Option>
            </AppSelect>
          </AppCol>
          <AppCol xs={24} sm={6} md={4}>
            <AppSelect
              value={projectFilter}
              onChange={setProjectFilter}
              style={{ width: "100%" }}
              placeholder="Projekt"
            >
              <Select.Option value="All">Wszystkie projekty</Select.Option>
              {projects.map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </AppSelect>
          </AppCol>
          <AppCol xs={24} sm={12} md={8}>
            <AppSpace>
              <AppButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNew}
                disabled={!canDesign}
              >
                Dodaj Nowy Kafelek
              </AppButton>
              <AppButton onClick={refresh}>Odśwież</AppButton>
            </AppSpace>
          </AppCol>
        </AppRow>
      </AppCard>

      {/* Statystyki */}
      <AppRow gutter={16} style={{ marginBottom: 16 }}>
        <AppCol xs={24} sm={6}>
          <AppCard size="small">
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                {filteredTiles.length}
              </Title>
              <div>Wszystkich kafelków</div>
            </div>
          </AppCard>
        </AppCol>
        <AppCol xs={24} sm={6}>
          <AppCard size="small">
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
                {
                  filteredTiles.filter(
                    (t) => (t.status as any) === "Zakończony"
                  ).length
                }
              </Title>
              <div>Zakończonych</div>
            </div>
          </AppCard>
        </AppCol>
        <AppCol xs={24} sm={6}>
          <AppCard size="small">
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ margin: 0, color: "#faad14" }}>
                {
                  filteredTiles.filter(
                    (t) =>
                      t.status === "W trakcie projektowania" ||
                      t.status === "Projektowanie"
                  ).length
                }
              </Title>
              <div>W projektowaniu</div>
            </div>
          </AppCard>
        </AppCol>
        <AppCol xs={24} sm={6}>
          <AppCard size="small">
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ margin: 0, color: "#f5222d" }}>
                {
                  filteredTiles.filter((t) => t.status === "Wymagają poprawek")
                    .length
                }
              </Title>
              <div>Wymagają poprawek</div>
            </div>
          </AppCard>
        </AppCol>
      </AppRow>

      {/* Kafelki */}
      <AppRow gutter={[16, 16]}>
        {filteredTiles.map((tile) => (
          <AppCol key={tile.id} xs={24} sm={12} lg={8} xl={6}>
            <TileCard
              tile={tile}
              onEdit={handleEdit}
              onView={handleView}
              onAssign={handleAssign}
            />
          </AppCol>
        ))}
      </AppRow>

      {filteredTiles.length === 0 && (
        <AppCard style={{ textAlign: "center", padding: 40 }}>
          <Title level={4} type="secondary">
            Brak kafelków
          </Title>
          <p>Nie znaleziono kafelków spełniających kryteria wyszukiwania.</p>
          <AppButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Dodaj pierwszy kafelek
          </AppButton>
        </AppCard>
      )}

      {/* Modal edycji */}
      <TileEditDrawer
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingTile(null);
        }}
        onSave={handleSaveTile}
        tile={editingTile || undefined}
      />
    </div>
  );
}
