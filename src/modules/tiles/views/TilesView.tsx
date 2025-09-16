import { Segmented } from "antd";
import { useState } from "react";
import { TileKanban } from "../components/TileKanban";
import { TileStats } from "../components/TileStats";
import { useTilesQuery } from "../hooks/useTilesQuery";

interface TilesViewProps {
  onViewTile?: (tile: any) => void;
  onEditTile?: (tile: any) => void;
  onAddTile?: () => void;
  onStatusChange?: (tile: any, status: string) => void;
}

export function TilesView({
  onViewTile,
  onEditTile,
  onAddTile,
  onStatusChange,
}: TilesViewProps) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const { data: tiles = [], error } = useTilesQuery();

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Error loading tiles: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2>Tiles Production</h2>
          <Segmented
            value={view}
            onChange={(value) => setView(value as "kanban" | "list")}
            options={[
              { label: "Kanban", value: "kanban" },
              { label: "List", value: "list" },
            ]}
          />
        </div>
      </div>

      <TileStats tiles={tiles} />

      <div style={{ marginTop: 24 }}>
        {view === "kanban" ? (
          <TileKanban
            tiles={tiles}
            onViewTile={onViewTile}
            onEditTile={onEditTile}
            onAddTile={onAddTile}
            onStatusChange={onStatusChange}
          />
        ) : (
          <div>
            {/* List view implementation would go here */}
            <p>List view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
