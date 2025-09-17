import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Avatar, Tooltip, Dropdown, Menu, message } from 'antd';
import { SendOutlined, MoreOutlined, SmileOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useMessagingStore } from '../../stores/messagingStore';
import { Message } from '../../types/messaging.types';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface ChatRoomProps {
  roomId: string;
  onClose?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    currentRoom,
    fetchMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    setTyping,
  } = useMessagingStore();
  
  const roomMessages = messages[roomId] || [];
  
  useEffect(() => {
    if (roomId) {
      fetchMessages(roomId);
    }
  }, [roomId, fetchMessages]);
  
  useEffect(() => {
    scrollToBottom();
  }, [roomMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage(roomId, newMessage.trim());
      setNewMessage('');
      setIsTyping(false);
    } catch (error) {
      message.error('Failed to send message');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (value && !isTyping) {
      setIsTyping(true);
      setTyping(roomId, true);
    } else if (!value && isTyping) {
      setIsTyping(false);
      setTyping(roomId, false);
    }
  };
  
  const handleEditMessage = async (messageId: string, content: string) => {
    try {
      await editMessage(messageId, content);
      message.success('Message updated');
    } catch (error) {
      message.error('Failed to edit message');
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      message.success('Message deleted');
    } catch (error) {
      message.error('Failed to delete message');
    }
  };
  
  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
    } catch (error) {
      message.error('Failed to add reaction');
    }
  };
  
  const renderMessage = (msg: Message) => {
    const isOwn = msg.sender_id === 'current-user'; // TODO: Get from auth context
    
    return (
      <div key={msg.id} className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isOwn && (
            <Avatar
              size="small"
              src={msg.sender?.avatar_url}
              className="mr-2"
            >
              {msg.sender?.name?.charAt(0)}
            </Avatar>
          )}
          
          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            <div
              className={`px-4 py-2 rounded-lg ${
                isOwn
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2">
                  {msg.attachments.map((attachment, index) => (
                    <div key={index} className="text-xs opacity-75">
                      📎 {attachment.filename}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(msg.created_at), { 
                  addSuffix: true, 
                  locale: pl 
                })}
              </span>
              
              {msg.reactions && msg.reactions.length > 0 && (
                <div className="flex space-x-1">
                  {msg.reactions.map((reaction, index) => (
                    <button
                      key={index}
                      className="text-xs hover:bg-gray-200 px-1 rounded"
                      onClick={() => handleReaction(msg.id, reaction.emoji)}
                    >
                      {reaction.emoji} {reaction.count}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Project Chat</h3>
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={<SmileOutlined />}
            onClick={() => message.info('Emoji picker coming soon')}
          />
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={() => message.info('More options coming soon')}
          />
          {onClose && (
            <Button type="text" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {roomMessages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={<PaperClipOutlined />}
            onClick={() => message.info('File upload coming soon')}
          />
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
