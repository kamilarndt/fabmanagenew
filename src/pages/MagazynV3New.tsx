import { MaterialsView } from "../modules/Materials";

export default function MagazynV3New() {
  const handleViewMaterial = (material: any) => {
    console.log("View material:", material);
  };

  const handleEditMaterial = (material: any) => {
    console.log("Edit material:", material);
  };

  const handleAddMaterial = () => {
    console.log("Add material");
  };

  const handleStockUpdate = (material: any) => {
    console.log("Update stock for:", material);
  };

  return (
    <MaterialsView
      onViewMaterial={handleViewMaterial}
      onEditMaterial={handleEditMaterial}
      onAddMaterial={handleAddMaterial}
      onStockUpdate={handleStockUpdate}
    />
  );
}
