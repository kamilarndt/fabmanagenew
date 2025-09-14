import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { Tile } from "../types";
import { TileCard } from "./TileCard";

const { Title } = Typography;

interface TileKanbanProps {
  tiles: Tile[];
  onViewTile?: (tile: Tile) => void;
  onEditTile?: (tile: Tile) => void;
  onStatusChange?: (tile: Tile, status: string) => void;
  onAddTile?: () => void;
}

const columns = [
  { key: "designing", title: "Designing", color: "blue" },
  { key: "pending_approval", title: "Pending Approval", color: "orange" },
  { key: "approved", title: "Approved", color: "green" },
  { key: "cnc_queue", title: "CNC Queue", color: "purple" },
  { key: "cnc_production", title: "CNC Production", color: "red" },
  { key: "ready_assembly", title: "Ready Assembly", color: "cyan" },
] as const;

export function TileKanban({
  tiles,
  onViewTile,
  onEditTile,
  onStatusChange,
  onAddTile,
}: TileKanbanProps) {
  const getTilesByStatus = (status: string) =>
    tiles.filter((tile) => tile.status === status);

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
          <Title level={3}>Tile Production Pipeline</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddTile}>
            Add Tile
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {columns.map((column) => {
          const columnTiles = getTilesByStatus(column.key);
          return (
            <Col key={column.key} xs={24} md={8} lg={4}>
              <FadeIn>
                <Card
                  title={
                    <Space>
                      <Tag color={column.color}>{column.title}</Tag>
                      <span>({columnTiles.length})</span>
                    </Space>
                  }
                  style={{ height: "100%", minHeight: 600 }}
                  bodyStyle={{ padding: 12 }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      minHeight: 500,
                    }}
                  >
                    {columnTiles.map((tile) => (
                      <TileCard
                        key={tile.id}
                        tile={tile}
                        onView={onViewTile}
                        onEdit={onEditTile}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                    {columnTiles.length === 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 200,
                          color: "#999",
                          border: "2px dashed #d9d9d9",
                          borderRadius: 6,
                        }}
                      >
                        No tiles in this stage
                      </div>
                    )}
                  </div>
                </Card>
              </FadeIn>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
