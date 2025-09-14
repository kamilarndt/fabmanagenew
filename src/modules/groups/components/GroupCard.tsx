import {
  EditOutlined,
  EyeOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Space, Tag, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { Group } from "../types";

const { Text, Title } = Typography;

interface GroupCardProps {
  group: Group;
  onView?: (group: Group) => void;
  onEdit?: (group: Group) => void;
  onManageMembers?: (group: Group) => void;
}

export function GroupCard({
  group,
  onView,
  onEdit,
  onManageMembers,
}: GroupCardProps) {
  const handleView = () => onView?.(group);
  const handleEdit = () => onEdit?.(group);
  const handleManageMembers = () => onManageMembers?.(group);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "blue";
      case "department":
        return "green";
      case "team":
        return "orange";
      case "client":
        return "purple";
      case "supplier":
        return "cyan";
      default:
        return "default";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "member":
        return "blue";
      case "viewer":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <FadeIn>
      <Card
        hoverable
        actions={[
          <Button
            key="view"
            type="text"
            icon={<EyeOutlined />}
            onClick={handleView}
          >
            View
          </Button>,
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </Button>,
          <Button
            key="members"
            type="text"
            icon={<TeamOutlined />}
            onClick={handleManageMembers}
          >
            Members
          </Button>,
        ]}
        style={{ height: "100%" }}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <Title level={4} style={{ margin: 0, flex: 1 }}>
              {group.name}
            </Title>
            <Tag color={getTypeColor(group.type)}>
              {group.type.toUpperCase()}
            </Tag>
          </div>

          {group.description && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {group.description}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag color={group.isActive ? "green" : "red"}>
              {group.isActive ? "ACTIVE" : "INACTIVE"}
            </Tag>
            <Tag icon={<TeamOutlined />} color="blue">
              {group.members.length} members
            </Tag>
            <Tag color="purple">{group.projects.length} projects</Tag>
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginBottom: 8, display: "block" }}>
            Members:
          </Text>
          <Avatar.Group maxCount={3} size="small">
            {group.members.slice(0, 5).map((member) => (
              <Avatar key={member.id} src={member.avatar}>
                {member.name.charAt(0)}
              </Avatar>
            ))}
          </Avatar.Group>
          {group.members.length > 5 && (
            <Text type="secondary" style={{ marginLeft: 8 }}>
              +{group.members.length - 5} more
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginBottom: 8, display: "block" }}>
            Admins:
          </Text>
          <Space wrap>
            {group.members
              .filter((member) => member.role === "admin")
              .map((member) => (
                <Tag key={member.id} color={getRoleColor(member.role)}>
                  <UserOutlined /> {member.name}
                </Tag>
              ))}
          </Space>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">
            Created: {new Date(group.createdAt).toLocaleDateString()}
          </Text>
          <Text type="secondary">
            Updated: {new Date(group.updatedAt).toLocaleDateString()}
          </Text>
        </div>
      </Card>
    </FadeIn>
  );
}
