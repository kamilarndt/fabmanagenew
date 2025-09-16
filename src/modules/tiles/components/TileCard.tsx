import {
  CalendarOutlined,
  EyeOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Progress, Space, Tooltip, Typography } from "antd";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseCard } from "../../../components/shared/BaseCard";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Tile } from "../../../types/tiles.types";

const { Text } = Typography;

interface TileCardProps {
  tile: Tile;
  onEdit?: (tile: Tile) => void;
  onView?: (tile: Tile) => void;
  onAssign?: (tile: Tile) => void;
}

export default function TileCard({
  tile,
  onEdit,
  onView,
  onAssign,
}: TileCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Brak terminu";
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const getMaterialSummary = () => {
    if (!tile.bom || tile.bom.length === 0) {
      return "Brak materiałów";
    }

    const totalMaterials = tile.bom.length;
    const keyMaterials = tile.bom.slice(0, 2);

    return (
      <div className="material-summary">
        <div className="key-materials">
          {keyMaterials.map((material) => (
            <div
              key={`${material.name}-${material.quantity}`}
              className="material-item"
            >
              <Text type="secondary" style={{ fontSize: "0.8rem" }}>
                - {material.name} ... {material.quantity} {material.unit}
              </Text>
            </div>
          ))}
        </div>
        {totalMaterials > 2 && (
          <Text type="secondary" style={{ fontSize: "0.75rem" }}>
            + {totalMaterials - 2} więcej...
          </Text>
        )}
      </div>
    );
  };

  const getProgressFromStatus = (status: string) => {
    const statusProgress: Record<string, number> = {
      "W KOLEJCE": 0,
      Projektowanie: 10,
      "W trakcie projektowania": 25,
      "Do akceptacji": 50,
      Zaakceptowane: 75,
      "W TRAKCIE CIĘCIA": 80,
      "W produkcji CNC": 85,
      WYCIĘTE: 90,
      "Gotowy do montażu": 95,
      Zakończony: 100,
      "Wymagają poprawek": 30,
      Wstrzymany: 0,
    };
    return statusProgress[status] || 0;
  };

  // Konwertuj Tile na BaseEntity
  const baseEntity: BaseEntity = {
    id: tile.id,
    name: tile.name,
    description: tile.opis || "Brak opisu",
    status: tile.status,
    priority: tile.priority || "medium",
    assignedTo: tile.przypisany_projektant || tile.assignee,
    projectId: tile.project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mapowanie kolorów statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "W KOLEJCE":
        return "blue";
      case "Projektowanie":
      case "W trakcie projektowania":
        return "green";
      case "Do akceptacji":
        return "orange";
      case "Zaakceptowane":
        return "cyan";
      case "W TRAKCIE CIĘCIA":
        return "red";
      case "WYCIĘTE":
        return "green";
      default:
        return "default";
    }
  };

  // Mapowanie kolorów priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "blue";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  // Custom fields dla BaseCard
  const customFields = (
    <div>
      {/* Podgląd 3D */}
      <div className="tile-preview" style={{ marginBottom: 12 }}>
        {tile.link_model_3d ? (
          <div
            style={{
              width: "100%",
              height: 120,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              cursor: "pointer",
              borderRadius: 6,
            }}
            onClick={() => window.open(tile.link_model_3d, "_blank")}
          >
            <Space direction="vertical" align="center">
              <EyeOutlined />
              <Text style={{ color: "white", fontSize: "0.8rem" }}>
                Podgląd 3D
              </Text>
            </Space>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: 120,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              borderRadius: 6,
            }}
          >
            🖼️
          </div>
        )}
      </div>

      {/* Status i deadline */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <StatusBadge status={tile.status} />
          <Text type="secondary" style={{ fontSize: "0.8rem" }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {formatDate(tile.termin)}
          </Text>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text strong style={{ fontSize: "0.8rem" }}>
            Postęp
          </Text>
          <Text style={{ fontSize: "0.8rem" }}>
            {getProgressFromStatus(tile.status)}%
          </Text>
        </div>
        <Progress
          percent={getProgressFromStatus(tile.status)}
          size="small"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
        />
      </div>

      {/* Materials section */}
      <div style={{ marginBottom: 12 }}>
        <Text
          strong
          style={{ fontSize: "0.8rem", marginBottom: 6, display: "block" }}
        >
          MATERIAŁY:
        </Text>
        {getMaterialSummary()}
      </div>

      {/* Module and assignee info */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid #f0f0f0",
        }}
      >
        {tile.moduł_nadrzędny && (
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary" style={{ fontSize: "0.75rem" }}>
              Moduł: {tile.moduł_nadrzędny}
            </Text>
          </div>
        )}
        {tile.przypisany_projektant && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ marginRight: 6 }}
            />
            <Text type="secondary" style={{ fontSize: "0.75rem" }}>
              {tile.przypisany_projektant}
            </Text>
          </div>
        )}
      </div>
    </div>
  );

  // Akcje dla BaseCard
  const actions = [
    <Tooltip key="view" title="Otwórz szczegóły">
      <Button
        type="text"
        icon={<EyeOutlined />}
        onClick={() => onView?.(tile)}
      />
    </Tooltip>,
    <Tooltip key="assign" title="Przypisz projektanta">
      <Button
        type="text"
        icon={<UserOutlined />}
        onClick={() => onAssign?.(tile)}
      />
    </Tooltip>,
    <Tooltip key="edit" title="Edytuj">
      <Button
        type="text"
        icon={<FileTextOutlined />}
        onClick={() => onEdit?.(tile)}
      />
    </Tooltip>,
  ];

  // Adaptery do konwersji BaseEntity z powrotem na Tile
  const handleView = (_entity: BaseEntity) => {
    onView?.(tile);
  };

  const handleEdit = (_entity: BaseEntity) => {
    onEdit?.(tile);
  };

  const handleDelete = (_entity: BaseEntity) => {
    onAssign?.(tile);
  };

  return (
    <BaseCard
      entity={baseEntity}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      statusColorMap={getStatusColor}
      priorityColorMap={getPriorityColor}
      customFields={customFields}
      actions={actions}
      data-component="TileCard"
      data-variant={tile.status}
      data-state={tile.priority || "normal"}
    />
  );
}
