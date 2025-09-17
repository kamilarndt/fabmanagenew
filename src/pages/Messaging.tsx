import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { ChatRoom } from "../components/Messaging/ChatRoom";
import { PresenceIndicator } from "../components/Messaging/PresenceIndicator";
import { useMessagingStore } from "../stores/messagingStore";
import { ChatRoom as ChatRoomType } from "../types/messaging.types";

const Messaging: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    rooms,
    roomsLoading,
    roomsError,
    fetchRooms,
    createRoom,
    getUnreadCount,
  } = useMessagingStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoom = async () => {
    try {
      await createRoom({
        name: "New Chat Room",
        description: "A new chat room for project discussion",
        type: "project",
        project_id: "current-project", // TODO: Get from context
        is_private: false,
        created_by: "current-user", // TODO: Get from auth context
      });
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRoom(null);
  };

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chat rooms...</p>
        </div>
      </div>
    );
  }

  if (roomsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading chat rooms: {roomsError}</p>
          <Button onClick={() => fetchRooms()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="mb-0">
              Messages
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateRoom}
            >
              New Room
            </Button>
          </div>

          <Input
            placeholder="Search rooms..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          <List
            dataSource={filteredRooms}
            renderItem={(room: ChatRoomType) => (
              <List.Item
                key={room.id}
                className="cursor-pointer hover:bg-gray-50 px-4 py-3"
                onClick={() => handleRoomSelect(room.id)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={room.unread_count} size="small">
                      <Avatar
                        icon={<MessageOutlined />}
                        className="bg-blue-100 text-blue-600"
                      />
                    </Badge>
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{room.name}</span>
                      {room.last_message && (
                        <Text type="secondary" className="text-xs">
                          {new Date(
                            room.last_message.created_at
                          ).toLocaleTimeString()}
                        </Text>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary" className="text-sm">
                        {room.last_message?.content ||
                          room.description ||
                          "No messages yet"}
                      </Text>
                      {room.participants && room.participants.length > 0 && (
                        <div className="mt-2">
                          <PresenceIndicator
                            users={room.participants}
                            maxVisible={3}
                          />
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageOutlined className="text-6xl text-gray-300 mb-4" />
          <Title level={3} className="text-gray-500">
            Select a chat room to start messaging
          </Title>
          <Text type="secondary">
            Choose from the list on the left or create a new room
          </Text>
        </div>
      </div>

      {/* Chat Drawer */}
      <Drawer
        title="Project Chat"
        placement="right"
        width={600}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        destroyOnClose
      >
        {selectedRoom && (
          <ChatRoom roomId={selectedRoom} onClose={handleCloseDrawer} />
        )}
      </Drawer>
    </div>
  );
};

export default Messaging;
