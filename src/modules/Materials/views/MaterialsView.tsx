import { MaterialList } from "../components/MaterialList";
import { MaterialStats } from "../components/MaterialStats";
import { useMaterialsQuery } from "../hooks/useMaterialsQuery";

interface MaterialsViewProps {
  onViewMaterial?: (material: any) => void;
  onEditMaterial?: (material: any) => void;
  onAddMaterial?: () => void;
  onStockUpdate?: (material: any) => void;
}

export function MaterialsView({
  onViewMaterial,
  onEditMaterial,
  onAddMaterial,
  onStockUpdate,
}: MaterialsViewProps) {
  const { data: materials = [], isLoading, error } = useMaterialsQuery();

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Error loading materials: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <MaterialStats materials={materials} />
      <div style={{ marginTop: 24 }}>
        <MaterialList
          materials={materials}
          loading={isLoading}
          onViewMaterial={onViewMaterial}
          onEditMaterial={onEditMaterial}
          onAddMaterial={onAddMaterial}
          onStockUpdate={onStockUpdate}
        />
      </div>
    </div>
  );
}
