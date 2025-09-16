import { MaterialsPage } from "@/new-ui";
import { useMaterialsStore } from "@/stores/materialsStore";
import * as React from "react";

export default function MaterialsV2(): React.ReactElement {
  const { materials } = useMaterialsStore();

  const transformedMaterials = React.useMemo(() => {
    return materials.map((material) => ({
      id: material.id,
      name: material.name,
      type: "Unknown", // No type field in current MaterialItem type
      supplier: "Unknown Supplier", // No supplier field in current MaterialItem type
      cost: 0, // No cost field in current MaterialItem type
      quantity: 0, // No quantity field in current MaterialItem type
      unit: "pcs",
      status: (material.stock <= material.minStock
        ? "low-stock"
        : material.stock === 0
        ? "out-of-stock"
        : "available") as "available" | "low-stock" | "out-of-stock",
      lastUpdated: new Date().toISOString(),
    }));
  }, [materials]);

  const handleMaterialClick = (materialId: string) => {
    console.log("Material clicked:", materialId);
    // Navigate to material details or open material modal
  };

  const handleAddMaterial = () => {
    console.log("Add material clicked");
    // Navigate to add material page or open add material modal
  };

  const handleEditMaterial = (materialId: string) => {
    console.log("Edit material clicked:", materialId);
    // Navigate to edit material page or open edit material modal
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      console.log("Delete material:", materialId);
      // TODO: Implement delete functionality when available in store
    }
  };

  return (
    <MaterialsPage
      materials={transformedMaterials}
      onMaterialClick={handleMaterialClick}
      onAddMaterial={handleAddMaterial}
      onEditMaterial={handleEditMaterial}
      onDeleteMaterial={handleDeleteMaterial}
    />
  );
}
