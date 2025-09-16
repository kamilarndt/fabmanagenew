import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Row, Space } from "antd";
import type { BaseEntity } from "./BaseCard";
import { BaseCard } from "./BaseCard";
import { PageHeader } from "./PageHeader";

interface BaseGridProps {
  entities: BaseEntity[];
  loading?: boolean;
  onViewEntity?: (entity: BaseEntity) => void;
  onEditEntity?: (entity: BaseEntity) => void;
  onDeleteEntity?: (entity: BaseEntity) => void;
  onAddEntity?: () => void;
  title?: string;
  subtitle?: string;
  statusColumns?: Array<{
    key: string;
    title: string;
    color?: string;
  }>;
  getStatusFromEntity?: (entity: BaseEntity) => string;
  statusColorMap?: (status: string) => string;
  priorityColorMap?: (priority: string) => string;
  customFields?: (entity: BaseEntity) => React.ReactNode;
  actions?: (entity: BaseEntity) => React.ReactNode[];
}

export function BaseGrid({
  entities,
  loading = false,
  onViewEntity,
  onEditEntity,
  onDeleteEntity,
  onAddEntity,
  title = "Entities",
  subtitle,
  statusColumns = [
    { key: "draft", title: "Draft", color: "default" },
    { key: "active", title: "Active", color: "blue" },
    { key: "completed", title: "Completed", color: "green" },
    { key: "cancelled", title: "Cancelled", color: "red" },
  ],
  getStatusFromEntity = (entity) => entity.status,
  statusColorMap,
  priorityColorMap,
  customFields,
  actions,
}: BaseGridProps) {
  const getEntitiesByStatus = (status: string) =>
    entities.filter((entity) => getStatusFromEntity(entity) === status);

  if (entities.length === 0 && !loading) {
    return (
      <div>
        <PageHeader
          title={title}
          subtitle={subtitle || `Manage your ${title.toLowerCase()}`}
          actions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddEntity}
            >
              Add {title.slice(0, -1)}
            </Button>
          }
        />
        <Empty
          description={`No ${title.toLowerCase()} found`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddEntity}>
            Add your first {title.slice(0, -1).toLowerCase()}
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle || `${entities.length} ${title.toLowerCase()}`}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAddEntity}>
              Add {title.slice(0, -1)}
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {statusColumns.map((column) => {
          const columnEntities = getEntitiesByStatus(column.key);
          return (
            <Col key={column.key} xs={24} md={12} lg={8}>
              <Card
                title={
                  <Space>
                    <span>{column.title}</span>
                    <span>({columnEntities.length})</span>
                  </Space>
                }
                style={{ height: "100%", minHeight: 400 }}
                bodyStyle={{ padding: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 300,
                  }}
                >
                  {columnEntities.map((entity) => (
                    <BaseCard
                      key={entity.id}
                      entity={entity}
                      onView={onViewEntity}
                      onEdit={onEditEntity}
                      onDelete={onDeleteEntity}
                      statusColorMap={statusColorMap}
                      priorityColorMap={priorityColorMap}
                      customFields={customFields?.(entity)}
                      actions={actions?.(entity)}
                    />
                  ))}
                  {columnEntities.length === 0 && (
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
                      No entities in this status
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
