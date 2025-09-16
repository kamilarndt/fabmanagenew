// import { PlusOutlined } from "@ant-design/icons";
// import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
// import { FadeIn } from "../../../components/ui/FadeIn";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseGrid } from "../../../components/shared/BaseGrid";
import type { Tile } from "../types/tiles.types";
import TileCard from "./TileCard";

// const { Title } = Typography;

interface TileKanbanProps {
  tiles: Tile[];
  onViewTile?: (tile: Tile) => void;
  onEditTile?: (tile: Tile) => void;
  onAddTile?: () => void;
  onStatusChange?: (tile: Tile, status: string) => void;
}

const columns = [
  { key: "new", title: "New", color: "blue" },
  { key: "in_progress", title: "In Progress", color: "green" },
  {
    key: "waiting_for_approval",
    title: "Waiting for Approval",
    color: "orange",
  },
  { key: "approved", title: "Approved", color: "cyan" },
  { key: "in_production", title: "In Production", color: "red" },
  { key: "completed", title: "Completed", color: "green" },
  { key: "designing", title: "Designing", color: "blue" },
  { key: "pending_approval", title: "Pending Approval", color: "orange" },
  { key: "cnc_queue", title: "CNC Queue", color: "purple" },
  { key: "cnc_production", title: "CNC Production", color: "red" },
  { key: "ready_assembly", title: "Ready Assembly", color: "cyan" },
];

export function TileKanban({
  tiles,
  onViewTile,
  onEditTile,
  onAddTile,
}: TileKanbanProps) {
  // Konwertuj Tile[] na BaseEntity[]
  const baseEntities: BaseEntity[] = tiles.map((tile) => ({
    id: tile.id,
    name: tile.name,
    description: tile.opis || "Brak opisu",
    status: tile.status,
    priority: tile.priority || "medium",
    assignedTo: tile.przypisany_projektant || tile.assignee,
    projectId: tile.project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // Mapowanie statusu na kolumny
  const getStatusFromEntity = (entity: BaseEntity) => {
    const tile = tiles.find((t) => t.id === entity.id);
    if (!tile) return "unknown";

    // Mapowanie statusów Tile na kolumny Kanban
    switch (tile.status) {
      case "W KOLEJCE":
        return "new";
      case "Projektowanie":
      case "W trakcie projektowania":
        return "designing";
      case "Do akceptacji":
        return "pending_approval";
      case "Zaakceptowane":
        return "approved";
      case "W TRAKCIE CIĘCIA":
        return "cnc_production";
      case "WYCIĘTE":
        return "ready_assembly";
      default:
        return "new";
    }
  };

  // Mapowanie kolorów statusu
  const statusColorMap = (status: string) => {
    switch (status) {
      case "new":
        return "blue";
      case "designing":
        return "green";
      case "pending_approval":
        return "orange";
      case "approved":
        return "cyan";
      case "cnc_production":
        return "red";
      case "ready_assembly":
        return "green";
      default:
        return "default";
    }
  };

  // Custom fields dla BaseGrid - renderuj TileCard
  const customFields = (entity: BaseEntity) => {
    const tile = tiles.find((t) => t.id === entity.id);
    if (!tile) return null;

    return (
      <TileCard
        tile={tile}
        onView={onViewTile}
        onEdit={onEditTile}
        onAssign={() => {}} // Brak funkcji assign w props
      />
    );
  };

  // Adaptery do konwersji BaseEntity z powrotem na Tile
  const handleViewEntity = (entity: BaseEntity) => {
    const tile = tiles.find((t) => t.id === entity.id);
    if (tile) onViewTile?.(tile);
  };

  const handleEditEntity = (entity: BaseEntity) => {
    const tile = tiles.find((t) => t.id === entity.id);
    if (tile) onEditTile?.(tile);
  };

  const handleDeleteEntity = (_entity: BaseEntity) => {
    // Brak funkcji delete w props
  };

  return (
    <BaseGrid
      entities={baseEntities}
      onViewEntity={handleViewEntity}
      onEditEntity={handleEditEntity}
      onDeleteEntity={handleDeleteEntity}
      onAddEntity={onAddTile}
      title="Tile Production Pipeline"
      subtitle={`${tiles.length} tile${
        tiles.length !== 1 ? "s" : ""
      } in production`}
      statusColumns={columns}
      getStatusFromEntity={getStatusFromEntity}
      statusColorMap={statusColorMap}
      customFields={customFields}
    />
  );
}
