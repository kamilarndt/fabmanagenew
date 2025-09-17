import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "../../new-ui/atoms/Button/Button";
import { Space } from "../../new-ui/atoms/Space/Space";
import { Tag } from "../../new-ui/atoms/Tag/Tag";
import { Typography } from "../../new-ui/atoms/Typography/Typography";
import { Card } from "../../new-ui/molecules/Card/Card";
import { useTilesStore } from "../../stores/tilesStore";
import type { Tile, TileStatus } from "../../types/tiles.types";

const { Text, Title } = Typography;

interface KanbanColumnProps {
  status: TileStatus;
  title: string;
  color: string;
  tiles: Tile[];
  onMoveTile: (tileId: string, newStatus: TileStatus) => void;
  onEditTile: (tile: Tile) => void;
  onDeleteTile: (tileId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  color,
  tiles,
  onMoveTile,
  onEditTile,
  onDeleteTile,
}) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            minHeight: "500px",
            backgroundColor: snapshot.isDraggingOver ? "#e6f7ff" : "#f5f5f5",
            borderRadius: "8px",
            padding: "16px",
            margin: "0 8px",
            flex: 1,
            transition: "background-color 0.2s ease",
          }}
        >
          <div
            style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: color,
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            <Title level={5} style={{ margin: 0 }}>
              {title} ({tiles.length})
            </Title>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {tiles.map((tile, index) => (
              <Draggable key={tile.id} draggableId={tile.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.8 : 1,
                    }}
                  >
                    <TileCard
                      tile={tile}
                      onEdit={onEditTile}
                      onDelete={onDeleteTile}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

interface TileCardProps {
  tile: Tile;
  onEdit: (tile: Tile) => void;
  onDelete: (tileId: string) => void;
}

const TileCard: React.FC<TileCardProps> = ({ tile, onEdit, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "blue";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <Card
      size="small"
      style={{
        cursor: "grab",
        marginBottom: "8px",
        transition: "all 0.2s ease",
      }}
      actions={[
        <Button
          key="edit"
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(tile)}
        />,
        <Button
          key="delete"
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(tile.id)}
        />,
      ]}
    >
      <div>
        <div style={{ marginBottom: "8px" }}>
          <Text strong>{tile.name}</Text>
        </div>

        {tile.description && (
          <div style={{ marginBottom: "8px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {tile.description}
            </Text>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tag color={getPriorityColor(tile.priority)}>
            {tile.priority.toUpperCase()}
          </Tag>

          {tile.assignee && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {tile.assignee.name}
            </Text>
          )}
        </div>

        {tile.tags && tile.tags.length > 0 && (
          <div style={{ marginTop: "8px" }}>
            <Space size={4}>
              {tile.tags.map((tag, index) => (
                <Tag key={index} size="small">
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {tile.progress > 0 && (
          <div style={{ marginTop: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <Text style={{ fontSize: "12px" }}>Progress</Text>
              <Text style={{ fontSize: "12px" }}>{tile.progress}%</Text>
            </div>
            <div
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#f0f0f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${tile.progress}%`,
                  height: "100%",
                  backgroundColor: "#1890ff",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

interface KanbanBoardProps {
  onEditTile: (tile: Tile) => void;
  onDeleteTile: (tileId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onEditTile,
  onDeleteTile,
}) => {
  const { tiles, moveTile } = useTilesStore();

  const columns = [
    { id: "backlog" as TileStatus, title: "Backlog", color: "#8c8c8c" },
    { id: "todo" as TileStatus, title: "To Do", color: "#1890ff" },
    { id: "in_progress" as TileStatus, title: "In Progress", color: "#faad14" },
    { id: "review" as TileStatus, title: "Review", color: "#722ed1" },
    { id: "testing" as TileStatus, title: "Testing", color: "#13c2c2" },
    { id: "done" as TileStatus, title: "Done", color: "#52c41a" },
  ];

  const getTilesByStatus = (status: TileStatus) => {
    return tiles.filter((tile) => tile.status === status);
  };

  const handleMoveTile = async (tileId: string, newStatus: TileStatus) => {
    try {
      await moveTile(tileId, newStatus);
    } catch (error) {
      console.error("Failed to move tile:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a valid drop zone
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move the tile to the new status
    const newStatus = destination.droppableId as TileStatus;
    handleMoveTile(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", overflowX: "auto", padding: "16px 0" }}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            status={column.id}
            title={column.title}
            color={column.color}
            tiles={getTilesByStatus(column.id)}
            onMoveTile={handleMoveTile}
            onEditTile={onEditTile}
            onDeleteTile={onDeleteTile}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
