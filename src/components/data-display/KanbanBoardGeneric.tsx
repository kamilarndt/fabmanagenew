import { Badge, Card, Col, ConfigProvider, Row } from "antd";
import React from "react";
import { AppDivider } from "../ui/AppDivider";
import { Body, Caption, H4 } from "../ui/Typography";

interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  maxItems?: number;
}

interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
  [key: string]: any;
}

interface KanbanBoardGenericProps<T extends KanbanItem> {
  items: T[];
  columns: KanbanColumn[];
  getColumnId: (item: T) => string;
  onItemClick?: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
  renderColumnExtra?: (column: KanbanColumn, items: T[]) => React.ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function KanbanBoardGeneric<T extends KanbanItem>({
  items,
  columns,
  getColumnId,
  onItemClick,
  renderItem,
  renderColumnExtra,
  loading = false,
  className,
  style,
}: KanbanBoardGenericProps<T>) {
  const getItemsByColumn = (columnId: string): T[] => {
    return items.filter((item) => getColumnId(item) === columnId);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "#ff4d4f";
      case "medium":
        return "#faad14";
      case "low":
        return "#52c41a";
      default:
        return "var(--text-muted)";
    }
  };

  const defaultRenderItem = (item: T) => (
    <Card
      hoverable={!!onItemClick}
      size="small"
      style={{
        marginBottom: 8,
        cursor: onItemClick ? "pointer" : "default",
        borderLeft: item.priority
          ? `3px solid ${getPriorityColor(item.priority)}`
          : undefined,
      }}
      onClick={() => onItemClick?.(item)}
      bodyStyle={{ padding: "12px" }}
    >
      <div>
        <Body weight="medium" style={{ margin: 0, marginBottom: 4 }}>
          {item.title}
        </Body>

        {item.description && (
          <Caption
            style={{
              margin: 0,
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.description}
          </Caption>
        )}

        {item.tags && item.tags.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                count={tag}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  marginRight: 4,
                  fontSize: 10,
                }}
              />
            ))}
            {item.tags.length > 3 && (
              <Caption>+{item.tags.length - 3} więcej</Caption>
            )}
          </div>
        )}

        {item.assignee && (
          <Caption style={{ margin: 0 }}>Przypisane: {item.assignee}</Caption>
        )}
      </div>
    </Card>
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            borderRadius: 6,
            fontFamily: "var(--font-family)",
          },
        },
      }}
    >
      <div className={className} style={style}>
        <Row gutter={[16, 16]}>
          {columns.map((column) => {
            const columnItems = getItemsByColumn(column.id);
            const isOverLimit =
              column.maxItems && columnItems.length > column.maxItems;

            return (
              <Col key={column.id} xs={24} sm={12} lg={8} xl={6}>
                <Card
                  loading={loading}
                  style={{
                    height: "fit-content",
                    minHeight: "400px",
                    borderTop: column.color
                      ? `4px solid ${column.color}`
                      : undefined,
                  }}
                  bodyStyle={{ padding: "16px" }}
                >
                  {/* Column Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <H4 style={{ margin: 0, marginBottom: 4 }}>
                        {column.title}
                      </H4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Badge
                          count={columnItems.length}
                          style={{
                            backgroundColor:
                              column.color || "var(--primary-main)",
                          }}
                        />
                        {column.maxItems && (
                          <Caption color={isOverLimit ? "danger" : "muted"}>
                            max: {column.maxItems}
                          </Caption>
                        )}
                      </div>
                    </div>

                    {renderColumnExtra && (
                      <div style={{ marginLeft: 12 }}>
                        {renderColumnExtra(column, columnItems)}
                      </div>
                    )}
                  </div>

                  <AppDivider spacing="sm" />

                  {/* Column Items */}
                  <div
                    style={{
                      maxHeight: "60vh",
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {columnItems.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "32px 16px",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Caption>Brak elementów</Caption>
                      </div>
                    ) : (
                      columnItems.map((item) => (
                        <div key={item.id}>
                          {renderItem
                            ? renderItem(item)
                            : defaultRenderItem(item)}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </ConfigProvider>
  );
}

// Simplified version for basic use cases
interface SimpleKanbanProps {
  items: Array<{ id: string; title: string; status: string }>;
  columns: Array<{ id: string; title: string; color?: string }>;
  onItemClick?: (item: any) => void;
}

export function SimpleKanban({
  items,
  columns,
  onItemClick,
}: SimpleKanbanProps) {
  return (
    <KanbanBoardGeneric
      items={items}
      columns={columns}
      getColumnId={(item) => item.status}
      onItemClick={onItemClick}
    />
  );
}

export default KanbanBoardGeneric;
