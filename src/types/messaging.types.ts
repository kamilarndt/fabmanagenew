export interface Message {
  id: string;
  project_id: string;
  author_id: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  reply_to?: string;
  edited_at?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  type: 'project' | 'direct' | 'group';
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface PresenceUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  current_room?: string;
}

export interface TypingIndicator {
  user_id: string;
  user_name: string;
  room_id: string;
  timestamp: number;
}
