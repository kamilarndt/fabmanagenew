import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Row, Space } from "antd";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { TemplateEntity } from "../types";
import { TemplateCard } from "./TemplateCard";

interface TemplateGridProps {
  entities: TemplateEntity[];
  loading?: boolean;
  onViewEntity?: (entity: TemplateEntity) => void;
  onEditEntity?: (entity: TemplateEntity) => void;
  onDeleteEntity?: (entity: TemplateEntity) => void;
  onAddEntity?: () => void;
}

export function TemplateGrid({
  entities,
  loading = false,
  onViewEntity,
  onEditEntity,
  onDeleteEntity,
  onAddEntity,
}: TemplateGridProps) {
  const getEntitiesByStatus = (status: string) =>
    entities.filter((entity) => entity.status === status);

  const statusColumns = [
    { key: "draft", title: "Draft", color: "default" },
    { key: "active", title: "Active", color: "blue" },
    { key: "completed", title: "Completed", color: "green" },
    { key: "cancelled", title: "Cancelled", color: "red" },
  ] as const;

  if (entities.length === 0 && !loading) {
    return (
      <div>
        <PageHeader
          title="Template Entities"
          subtitle="Manage your template entities"
          actions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddEntity}
            >
              Add Entity
            </Button>
          }
        />
        <Empty
          description="No entities found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddEntity}>
            Add your first entity
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Template Entities"
        subtitle={`${entities.length} entit${
          entities.length !== 1 ? "ies" : "y"
        } found`}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAddEntity}>
              Add Entity
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
                    <TemplateCard
                      key={entity.id}
                      entity={entity}
                      onView={onViewEntity}
                      onEdit={onEditEntity}
                      onDelete={onDeleteEntity}
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

