import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseStats } from "../../../components/shared/BaseStats";
import type { Tile } from "../types/tiles.types";

interface TileStatsProps {
  tiles: Tile[];
}

export function TileStats({ tiles }: TileStatsProps) {
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

  // Mapowanie statusu na kategorie
  const getStatusFromEntity = (entity: BaseEntity) => {
    const tile = tiles.find((t) => t.id === entity.id);
    if (!tile) return "unknown";

    // Mapowanie statusów Tile na kategorie
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

  // Mapowanie priorytetu
  const getPriorityFromEntity = (entity: BaseEntity) => {
    const tile = tiles.find((t) => t.id === entity.id);
    return tile?.priority || "medium";
  };

  // Custom stats dla Tile
  const customStats = [
    {
      title: "Designing",
      value: tiles.filter(
        (t) =>
          t.status === "Projektowanie" || t.status === "W trakcie projektowania"
      ).length,
      color: "#1890ff",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Pending Approval",
      value: tiles.filter((t) => t.status === "Do akceptacji").length,
      color: "#faad14",
      icon: <PauseCircleOutlined />,
    },
    {
      title: "CNC Queue",
      value: tiles.filter((t) => t.status === "Zaakceptowane").length,
      color: "#722ed1",
      icon: <SettingOutlined />,
    },
    {
      title: "CNC Production",
      value: tiles.filter((t) => t.status === "W TRAKCIE CIĘCIA").length,
      color: "#ff4d4f",
      icon: <PlayCircleOutlined />,
    },
    {
      title: "Ready Assembly",
      value: tiles.filter((t) => t.status === "WYCIĘTE").length,
      color: "#13c2c2",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Overdue",
      value: tiles.filter((t) => {
        if (!t.termin) return false;
        return new Date(t.termin) < new Date() && t.status !== "WYCIĘTE";
      }).length,
      color: "#ff4d4f",
      icon: <ExclamationCircleOutlined />,
    },
  ];

  return (
    <BaseStats
      entities={baseEntities}
      title="Tile Production Overview"
      getStatusFromEntity={getStatusFromEntity}
      getPriorityFromEntity={getPriorityFromEntity}
      customStats={customStats}
    />
  );
}
