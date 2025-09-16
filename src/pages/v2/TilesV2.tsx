import { TilesPage } from "@/new-ui";
import { useTilesStore } from "@/stores/tilesStore";
import * as React from "react";

export default function TilesV2(): React.ReactElement {
  const { tiles } = useTilesStore();

  const transformedTiles = React.useMemo(() => {
    return tiles.map((tile) => ({
      id: tile.id,
      name: tile.name,
      status:
        (tile.status as "pending" | "in-progress" | "completed" | "on-hold") ||
        "pending",
      progress: 0, // No progress field in current Tile type
      material: "Unknown Material", // No material field in current Tile type
      dimensions: "Not specified", // No dimensions field in current Tile type
      priority: (tile.priority as "low" | "medium" | "high") || "medium",
      assignedTo: tile.assignee || "Unassigned",
      dueDate: "Not set", // No dueDate field in current Tile type
      project: tile.project || "Unknown Project",
    }));
  }, [tiles]);

  const handleTileClick = (tileId: string) => {
    console.log("Tile clicked:", tileId);
    // Navigate to tile details or open tile modal
  };

  const handleAddTile = () => {
    console.log("Add tile clicked");
    // Navigate to add tile page or open add tile modal
  };

  const handleEditTile = (tileId: string) => {
    console.log("Edit tile clicked:", tileId);
    // Navigate to edit tile page or open edit tile modal
  };

  const handleDeleteTile = (tileId: string) => {
    if (window.confirm("Are you sure you want to delete this tile?")) {
      console.log("Delete tile:", tileId);
      // TODO: Implement delete functionality when available in store
    }
  };

  return (
    <TilesPage
      tiles={transformedTiles}
      onTileClick={handleTileClick}
      onAddTile={handleAddTile}
      onEditTile={handleEditTile}
      onDeleteTile={handleDeleteTile}
    />
  );
}
