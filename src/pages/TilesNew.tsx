import { TilesView } from "../modules/tiles";

export default function TilesNew() {
  const handleViewTile = (tile: any) => {
    console.log("View tile:", tile);
  };

  const handleEditTile = (tile: any) => {
    console.log("Edit tile:", tile);
  };

  const handleAddTile = () => {
    console.log("Add tile");
  };

  const handleStatusChange = (tile: any, status: string) => {
    console.log("Change status:", tile, status);
  };

  return (
    <TilesView
      onViewTile={handleViewTile}
      onEditTile={handleEditTile}
      onAddTile={handleAddTile}
      onStatusChange={handleStatusChange}
    />
  );
}
