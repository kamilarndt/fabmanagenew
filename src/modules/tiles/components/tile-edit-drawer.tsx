import { useState } from "react";
import { TileForm } from "../../../components/shared/BaseForm";
import { useTilesStore } from "../../../stores/tilesStore";
import type { Tile } from "../../../types/tiles.types";

interface TileEditDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave?: (tileData: Omit<Tile, "id">) => void | Promise<void>;
  tile?: Tile | null;
  projectId?: string;
}

function TileEditDrawer({
  open,
  onClose,
  onSave,
  tile,
  projectId,
}: TileEditDrawerProps) {
  const [loading, setLoading] = useState(false);
  const { updateTile, addTile } = useTilesStore();

  const handleSave = async (values: Partial<Tile>) => {
    try {
      setLoading(true);
      
      const tileData: Partial<Tile> = {
        ...values,
        project: projectId || tile?.project,
      };

      if (tile?.id) {
        await updateTile(tile.id, tileData);
      } else {
        const newTile = { ...tileData, id: `temp-${Date.now()}` } as Tile;
        await addTile(newTile);
      }

      // Call external onSave if provided
      if (onSave) {
        await onSave(tileData as Omit<Tile, "id">);
      }
    } catch (error) {
      console.error("Error saving tile:", error);
      throw error; // Re-throw to let BaseForm handle the error display
    } finally {
      setLoading(false);
    }
  };

  return (
    <TileForm
      tile={tile}
      open={open}
      onClose={onClose}
      onSave={handleSave}
      loading={loading}
    />
  );
}

export default TileEditDrawer;
