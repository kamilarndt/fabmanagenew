// Project Timeline Component - Shows project activity timeline
import React from "react";
// Timeline component not available in new-ui yet, using Ant Design temporarily
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  MessageOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Timeline } from "antd";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { Empty } from "../../atoms/Empty/Empty";
import { Tag } from "../../atoms/Tag/Tag";
import { Typography } from "../../atoms/Typography/Typography";

const { Text, Paragraph } = Typography;

interface ProjectTimelineProps {
  activity: Array<{
    id: string;
    project_id: string;
    type: string;
    payload_json: any;
    actor_id: string | null;
    created_at: string;
    actor?: {
      id: string;
      email: string;
      raw_user_meta_data: any;
    };
  }>;
  isLoading: boolean;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  activity,
  isLoading,
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
      case "project_messages_INSERT":
        return <MessageOutlined />;
      case "project_created":
        return <PlusOutlined />;
      case "status_change":
        return <CheckCircleOutlined />;
      case "file_upload":
        return <FileTextOutlined />;
      case "bom_updated":
      case "bom_items_INSERT":
        return <PlusOutlined />;
      case "bom_items_UPDATE":
        return <EditOutlined />;
      case "bom_items_DELETE":
        return <DeleteOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "project_created":
        return "green";
      case "message":
      case "project_messages_INSERT":
        return "blue";
      case "status_change":
        return "orange";
      case "bom_updated":
      case "bom_items_INSERT":
      case "bom_items_UPDATE":
      case "bom_items_DELETE":
        return "purple";
      default:
        return "gray";
    }
  };

  const formatActivityMessage = (activity: any) => {
    const { type, payload_json } = activity;

    switch (type) {
      case "project_created":
        return `Project "${payload_json?.project_name || "Unknown"}" was created`;

      case "message":
      case "project_messages_INSERT":
        return "New message added";

      case "status_change":
        return `Status changed from "${payload_json?.old_status}" to "${payload_json?.new_status}"`;

      case "bom_items_INSERT":
        return `BOM item added: ${payload_json?.material_name || "Unknown material"}`;

      case "bom_items_UPDATE":
        return `BOM item updated: ${payload_json?.material_name || "Unknown material"}`;

      case "bom_items_DELETE":
        return `BOM item removed: ${payload_json?.material_name || "Unknown material"}`;

      case "bom_updated":
        return `BOM updated with ${payload_json?.items_added || 0} items`;

      case "pricing_calculated":
        return `Pricing calculated: ${
          payload_json?.total_cost
            ? new Intl.NumberFormat("pl-PL", {
                style: "currency",
                currency: "PLN",
              }).format(payload_json.total_cost)
            : "Unknown amount"
        }`;

      default:
        return `Activity: ${type}`;
    }
  };

  const getActorName = (actor: any) => {
    if (actor?.raw_user_meta_data?.full_name) {
      return actor.raw_user_meta_data.full_name;
    }
    if (actor?.raw_user_meta_data?.name) {
      return actor.raw_user_meta_data.name;
    }
    return actor?.email?.split("@")[0] || "System";
  };

  const getActorInitials = (actor: any) => {
    const name = getActorName(actor);
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activity.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No activity yet"
      />
    );
  }

  return (
    <Timeline
      items={activity.map((item) => ({
        dot: (
          <Avatar
            size="small"
            style={{
              backgroundColor: getActivityColor(item.type),
              color: "white",
            }}
            icon={getActivityIcon(item.type)}
          />
        ),
        children: (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Text strong>{formatActivityMessage(item)}</Text>
              <Text type="secondary" className="text-xs">
                {formatDate(item.created_at)}
              </Text>
            </div>

            <div className="flex items-center space-x-2">
              <Avatar size="small" style={{ backgroundColor: "#87d068" }}>
                {item.actor ? getActorInitials(item.actor) : "S"}
              </Avatar>
              <Text type="secondary" className="text-sm">
                {item.actor ? getActorName(item.actor) : "System"}
              </Text>
            </div>

            {item.payload_json && (
              <div className="mt-2">
                <Tag color={getActivityColor(item.type)} className="text-xs">
                  {item.type}
                </Tag>
              </div>
            )}
          </div>
        ),
      }))}
    />
  );
};
