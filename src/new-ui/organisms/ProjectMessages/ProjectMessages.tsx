// Project Messages Component - Shows project messages with composer
import { DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useRealtimeEvent } from "../../../hooks/useRealtime";
import { useProjectStore } from "../../../stores/projectStore";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { Button } from "../../atoms/Button/Button";
import { Divider } from "../../atoms/Divider/Divider";
import { Input } from "../../atoms/Input/Input";
import { Space } from "../../atoms/Space/Space";
import { Typography } from "../../atoms/Typography/Typography";
import { List } from "../../molecules/List/List";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface ProjectMessagesProps {
  messages: Array<{
    id: string;
    project_id: string;
    author_id: string;
    body_html: string;
    created_at: string;
    updated_at: string;
    author?: {
      id: string;
      email: string;
      raw_user_meta_data: any;
    };
  }>;
  isLoading: boolean;
}

export const ProjectMessages: React.FC<ProjectMessagesProps> = ({
  messages,
  isLoading,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { addMessage, currentProject, fetchMessages } = useProjectStore();

  // Listen for real-time message updates
  useRealtimeEvent("project-message-updated", (payload) => {
    console.log("New message received:", payload);
    if (currentProject && payload.new?.project_id === currentProject.id) {
      fetchMessages(currentProject.id);
    }
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentProject) return;

    setIsComposing(true);
    try {
      await addMessage(currentProject.id, newMessage.trim());
      setNewMessage("");
      message.success("Message sent successfully");
    } catch (error) {
      message.error("Failed to send message");
    } finally {
      setIsComposing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString("pl-PL", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  const getAuthorName = (author: any) => {
    if (author?.raw_user_meta_data?.full_name) {
      return author.raw_user_meta_data.full_name;
    }
    if (author?.raw_user_meta_data?.name) {
      return author.raw_user_meta_data.name;
    }
    return author?.email?.split("@")[0] || "Unknown User";
  };

  const getAuthorInitials = (author: any) => {
    const name = getAuthorName(author);
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Messages List */}
      <List
        loading={isLoading}
        dataSource={messages}
        locale={{ emptyText: "No messages yet. Start the conversation!" }}
        header={
          typingUsers.length > 0 && (
            <div className="text-sm text-gray-500 italic">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
              typing...
            </div>
          )
        }
        renderItem={(message) => (
          <List.Item className="!border-none !px-0">
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: "#1890ff",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {message.author ? getAuthorInitials(message.author) : "U"}
                </Avatar>
              }
              title={
                <div className="flex items-center justify-between">
                  <Space>
                    <Text strong>
                      {message.author
                        ? getAuthorName(message.author)
                        : "Unknown User"}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {formatDate(message.created_at)}
                    </Text>
                  </Space>
                  <Space size="small">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Space>
                </div>
              }
              description={
                <div className="group">
                  <Paragraph
                    className="mb-0"
                    style={{
                      whiteSpace: "pre-wrap",
                      marginBottom: 0,
                    }}
                  >
                    {message.body_html.replace(/<[^>]*>/g, "")}
                  </Paragraph>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {/* Message Composer */}
      <Divider />
      <div className="space-y-3">
        <Text strong>Add a message:</Text>
        <div className="space-y-2">
          <TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            autoSize={{ minRows: 3, maxRows: 6 }}
            onPressEnter={(e) => {
              if (e.shiftKey) return;
              e.preventDefault();
              handleSendMessage();
            }}
            onFocus={() => {
              // TODO: Implement typing indicator
              console.log("User started typing");
            }}
            onBlur={() => {
              // TODO: Implement typing indicator
              console.log("User stopped typing");
            }}
          />
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={isComposing}
              disabled={!newMessage.trim()}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
