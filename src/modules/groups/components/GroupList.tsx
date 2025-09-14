import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Row, Space } from "antd";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { Group } from "../types";
import { GroupCard } from "./GroupCard";

interface GroupListProps {
  groups: Group[];
  loading?: boolean;
  onViewGroup?: (group: Group) => void;
  onEditGroup?: (group: Group) => void;
  onManageMembers?: (group: Group) => void;
  onAddGroup?: () => void;
}

export function GroupList({
  groups,
  loading = false,
  onViewGroup,
  onEditGroup,
  onManageMembers,
  onAddGroup,
}: GroupListProps) {
  if (groups.length === 0 && !loading) {
    return (
      <div>
        <PageHeader
          title="Groups"
          subtitle="Manage teams, departments, and project groups"
          actions={
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddGroup}>
              Add Group
            </Button>
          }
        />
        <Empty
          description="No groups found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddGroup}>
            Add your first group
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Groups"
        subtitle={`${groups.length} group${
          groups.length !== 1 ? "s" : ""
        } total`}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAddGroup}>
              Add Group
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {groups.map((group) => (
          <Col key={group.id} xs={24} sm={12} lg={8} xl={6}>
            <GroupCard
              group={group}
              onView={onViewGroup}
              onEdit={onEditGroup}
              onManageMembers={onManageMembers}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
