import {
  ExclamationCircleOutlined,
  InboxOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseStats } from "../../../components/shared/BaseStats";
import type { Material } from "../types";

interface MaterialStatsProps {
  materials: Material[];
}

export function MaterialStats({ materials }: MaterialStatsProps) {
  // Konwertuj Material[] na BaseEntity[]
  const baseEntities: BaseEntity[] = materials.map((material) => ({
    id: material.id,
    name: material.name || "Unknown Material",
    description: material.description || `${material.category || "Standard"}`,
    status: "available",
    priority: "medium",
    assignedTo: material.supplier,
    projectId: undefined,
    createdAt: material.createdAt || new Date().toISOString(),
    updatedAt: material.updatedAt || new Date().toISOString(),
  }));

  // Mapowanie statusu na kategorie
  const getStatusFromEntity = (entity: BaseEntity) => {
    const material = materials.find((m) => m.id === entity.id);
    if (!material) return "unknown";

    // Mapowanie statusu materiału na kategorie
    const ratio = material.stock / material.minStock;
    if (ratio < 0.5) return "critical";
    if (ratio < 1) return "low";
    if (ratio > material.maxStock / material.minStock) return "excess";
    return "normal";
  };

  // Mapowanie priorytetu
  const getPriorityFromEntity = (_entity: BaseEntity) => {
    return "medium";
  };

  // Custom stats dla Material
  const customStats = [
    {
      title: "Low Stock",
      value: materials.filter((m) => m.stock <= m.minStock && m.stock > 0)
        .length,
      color: "#faad14",
      icon: <WarningOutlined />,
    },
    {
      title: "Out of Stock",
      value: materials.filter((m) => m.stock === 0).length,
      color: "#ff4d4f",
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Total Value",
      value: materials.reduce((sum, m) => sum + m.stock * m.price, 0),
      color: "#52c41a",
      icon: <InboxOutlined />,
    },
    {
      title: "Categories",
      value: new Set(materials.map((m) => m.category)).size,
      color: "#1890ff",
      icon: <InboxOutlined />,
    },
  ];

  return (
    <BaseStats
      entities={baseEntities}
      title="Inventory Overview"
      getStatusFromEntity={getStatusFromEntity}
      getPriorityFromEntity={getPriorityFromEntity}
      customStats={customStats}
    />
  );
}
