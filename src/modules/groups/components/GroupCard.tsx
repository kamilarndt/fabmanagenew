import {
  EditOutlined,
  EyeOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  AppButton,
  AppCard,
  AppSpace,
  AppTag
} from "../../../components/ui";
import { Avatar, Typography } from "antd";

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
      <AppCard
        hoverable
        actions={[
          <AppButton
            key="view"
            type="text"
            icon={<EyeOutlined />}
            onClick={handleView}
          >
            View
          </AppButton>,
          <AppButton
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </AppButton>,
          <AppButton
            key="members"
            type="text"
            icon={<TeamOutlined />}
            onClick={handleManageMembers}
          >
            Members
          </AppButton>,
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
            <AppTag color={getTypeColor(group.type)}>
              {group.type.toUpperCase()}
            </AppTag>
          </div>

          {group.description && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {group.description}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <AppSpace wrap>
            <AppTag color={group.isActive ? "green" : "red"}>
              {group.isActive ? "ACTIVE" : "INACTIVE"}
            </AppTag>
            <AppTag icon={<TeamOutlined />} color="blue">
              {group.members.length} members
            </AppTag>
            <AppTag color="purple">{group.projects.length} projects</AppTag>
          </AppSpace>
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
          <AppSpace wrap>
            {group.members
              .filter((member) => member.role === "admin")
              .map((member) => (
                <AppTag key={member.id} color={getRoleColor(member.role)}>
                  <UserOutlined /> {member.name}
                </AppTag>
              ))}
          </AppSpace>
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
      </AppCard>
    </FadeIn>
  );
}
