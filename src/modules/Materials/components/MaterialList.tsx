// import { PlusOutlined } from "@ant-design/icons";
// import { Button, Space } from "antd";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseGrid } from "../../../components/shared/BaseGrid";
import type { Material } from "../types";
import { MaterialCard } from "./MaterialCard";

interface MaterialListProps {
  materials: Material[];
  loading?: boolean;
  onViewMaterial?: (material: Material) => void;
  onEditMaterial?: (material: Material) => void;
  onAddMaterial?: () => void;
  onStockUpdate?: (material: Material) => void;
}

export function MaterialList({
  materials,
  loading = false,
  onViewMaterial,
  onEditMaterial,
  onAddMaterial,
  onStockUpdate,
}: MaterialListProps) {
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

  // Mapowanie statusu materiału na kolumny
  const getStatusFromEntity = (entity: BaseEntity) => {
    const material = materials.find((m) => m.id === entity.id);
    if (!material) return "unknown";

    const ratio = material.stock / material.minStock;
    if (ratio < 0.5) return "critical";
    if (ratio < 1) return "low";
    if (ratio > material.maxStock / material.minStock) return "excess";
    return "normal";
  };

  // Mapowanie kolorów statusu
  const statusColorMap = (status: string) => {
    switch (status) {
      case "critical":
        return "red";
      case "low":
        return "orange";
      case "excess":
        return "blue";
      case "normal":
        return "green";
      default:
        return "default";
    }
  };

  // Custom fields dla BaseGrid - renderuj MaterialCard
  const customFields = (entity: BaseEntity) => {
    const material = materials.find((m) => m.id === entity.id);
    if (!material) return null;

    return (
      <MaterialCard
        material={material as any}
        onSelect={onViewMaterial as any}
        onQuickOrder={onEditMaterial as any}
        onAddToProject={onStockUpdate as any}
      />
    );
  };

  // Adaptery do konwersji BaseEntity z powrotem na Material
  const handleViewEntity = (entity: BaseEntity) => {
    const material = materials.find((m) => m.id === entity.id);
    if (material) onViewMaterial?.(material);
  };

  const handleEditEntity = (entity: BaseEntity) => {
    const material = materials.find((m) => m.id === entity.id);
    if (material) onEditMaterial?.(material);
  };

  const handleDeleteEntity = (entity: BaseEntity) => {
    const material = materials.find((m) => m.id === entity.id);
    if (material) onStockUpdate?.(material);
  };

  // Kolumny statusu dla materiałów
  const statusColumns = [
    { key: "critical", title: "Critical", color: "red" },
    { key: "low", title: "Low Stock", color: "orange" },
    { key: "normal", title: "Normal", color: "green" },
    { key: "excess", title: "Excess", color: "blue" },
  ];

  return (
    <BaseGrid
      entities={baseEntities}
      loading={loading}
      onViewEntity={handleViewEntity}
      onEditEntity={handleEditEntity}
      onDeleteEntity={handleDeleteEntity}
      onAddEntity={onAddMaterial}
      title="Materials"
      subtitle={`${materials.length} material${
        materials.length !== 1 ? "s" : ""
      } in inventory`}
      statusColumns={statusColumns}
      getStatusFromEntity={getStatusFromEntity}
      statusColorMap={statusColorMap}
      customFields={customFields}
    />
  );
}
