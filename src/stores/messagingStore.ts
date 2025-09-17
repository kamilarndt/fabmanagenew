import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { fetchWithMockFallback, mockData } from '../lib/api';
import type { Message, ChatRoom, PresenceUser, TypingIndicator } from '../types/messaging.types';

interface MessagingState {
  messages: Record<string, Message[]>; // room_id -> messages
  rooms: ChatRoom[];
  roomsLoading: boolean;
  roomsError: string | null;
  
  currentRoom: string | null;
  onlineUsers: PresenceUser[];
  typingUsers: TypingIndicator[];
  
  // Actions
  fetchRooms: () => Promise<void>;
  createRoom: (room: Omit<ChatRoom, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string, type?: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  
  setTyping: (roomId: string, isTyping: boolean) => void;
  setPresence: (status: 'online' | 'away' | 'busy' | 'offline') => void;
  
  // Computed
  getCurrentRoomMessages: () => Message[];
  getUnreadCount: () => number;
}

export const useMessagingStore = create<MessagingState>()(
  immer((set, get) => ({
    messages: {},
    rooms: [],
    roomsLoading: false,
    roomsError: null,
    
    currentRoom: null,
    onlineUsers: [],
    typingUsers: [],
    
    fetchRooms: async () => {
      set((state) => {
        state.roomsLoading = true;
        state.roomsError = null;
      });
      
      try {
        const rooms = await fetchWithMockFallback(
          '/api/messaging/rooms',
          mockData.messaging.chatRooms
        );
        
        set((state) => {
          state.rooms = rooms;
          state.roomsLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.roomsError = error instanceof Error ? error.message : 'Unknown error';
          state.roomsLoading = false;
        });
      }
    },
    
    createRoom: async (roomData) => {
      try {
        const response = await fetch('/api/messaging/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomData),
        });
        const room = await response.json();
        
        set((state) => {
          state.rooms.push(room);
        });
      } catch (error) {
        throw error;
      }
    },
    
    joinRoom: (roomId) => {
      set((state) => {
        state.currentRoom = roomId;
      });
    },
    
    leaveRoom: (roomId) => {
      set((state) => {
        if (state.currentRoom === roomId) {
          state.currentRoom = null;
        }
      });
    },
    
    fetchMessages: async (roomId) => {
      try {
        const response = await fetch(`/api/messaging/rooms/${roomId}/messages`);
        const messages = await response.json();
        
        set((state) => {
          state.messages[roomId] = messages;
        });
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    },
    
    sendMessage: async (roomId, content, type = 'text') => {
      try {
        const response = await fetch(`/api/messaging/rooms/${roomId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, type }),
        });
        const message = await response.json();
        
        set((state) => {
          if (!state.messages[roomId]) {
            state.messages[roomId] = [];
          }
          state.messages[roomId].push(message);
        });
      } catch (error) {
        throw error;
      }
    },
    
    editMessage: async (messageId, content) => {
      try {
        const response = await fetch(`/api/messaging/messages/${messageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        const message = await response.json();
        
        set((state) => {
          Object.keys(state.messages).forEach(roomId => {
            const index = state.messages[roomId].findIndex(m => m.id === messageId);
            if (index !== -1) {
              state.messages[roomId][index] = { ...state.messages[roomId][index], ...message };
            }
          });
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteMessage: async (messageId) => {
      try {
        const response = await fetch(`/api/messaging/messages/${messageId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete message');
        
        set((state) => {
          Object.keys(state.messages).forEach(roomId => {
            state.messages[roomId] = state.messages[roomId].filter(m => m.id !== messageId);
          });
        });
      } catch (error) {
        throw error;
      }
    },
    
    addReaction: async (messageId, emoji) => {
      try {
        const response = await fetch(`/api/messaging/messages/${messageId}/reactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emoji }),
        });
        const reaction = await response.json();
        
        set((state) => {
          Object.keys(state.messages).forEach(roomId => {
            const message = state.messages[roomId].find(m => m.id === messageId);
            if (message) {
              if (!message.reactions) {
                message.reactions = [];
              }
              message.reactions.push(reaction);
            }
          });
        });
      } catch (error) {
        throw error;
      }
    },
    
    removeReaction: async (messageId, emoji) => {
      try {
        const response = await fetch(`/api/messaging/messages/${messageId}/reactions`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emoji }),
        });
        
        if (!response.ok) throw new Error('Failed to remove reaction');
        
        set((state) => {
          Object.keys(state.messages).forEach(roomId => {
            const message = state.messages[roomId].find(m => m.id === messageId);
            if (message && message.reactions) {
              message.reactions = message.reactions.filter(r => r.emoji !== emoji);
            }
          });
        });
      } catch (error) {
        throw error;
      }
    },
    
    setTyping: (roomId, isTyping) => {
      // TODO: Implement WebSocket typing indicator
      console.log('Typing:', roomId, isTyping);
    },
    
    setPresence: (status) => {
      // TODO: Implement WebSocket presence update
      console.log('Presence:', status);
    },
    
    getCurrentRoomMessages: () => {
      const { currentRoom, messages } = get();
      return currentRoom ? messages[currentRoom] || [] : [];
    },
    
    getUnreadCount: () => {
      const { rooms } = get();
      return rooms.reduce((total, room) => total + room.unread_count, 0);
    },
  }))
);
