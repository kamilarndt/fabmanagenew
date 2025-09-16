import type { Tile } from "../../types/tiles.types";

interface KanbanColumnProps {
  columnId: string;
  title: string;
  color: string;
  tiles: Tile[];
  onTileUpdate: (tileId: string, updates: Partial<Tile>) => void;
  onTileClick: (tile: Tile) => void;
  tileCosts: number[];
  projectTiles: Tile[];
}

export default function KanbanColumn({
  title,
  color,
  tiles,
  onTileClick,
}: KanbanColumnProps) {
  return (
    <div className="col-md-3">
      <div className="card">
        <div className="card-header" style={{ backgroundColor: color }}>
          <h6 className="mb-0">{title}</h6>
        </div>
        <div className="card-body">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="tile-item"
              onClick={() => onTileClick(tile)}
              style={{ cursor: "pointer" }}
            >
              {tile.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
