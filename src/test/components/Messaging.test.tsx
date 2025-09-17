import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Messaging } from '../../pages/Messaging';

// Mock the store
vi.mock('../../stores/messagingStore', () => ({
  useMessagingStore: () => ({
    messages: {},
    rooms: [],
    roomsLoading: false,
    roomsError: null,
    currentRoom: null,
    onlineUsers: [],
    typingUsers: [],
    fetchRooms: vi.fn(),
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    leaveRoom: vi.fn(),
    fetchMessages: vi.fn(),
    sendMessage: vi.fn(),
    editMessage: vi.fn(),
    deleteMessage: vi.fn(),
    addReaction: vi.fn(),
    removeReaction: vi.fn(),
    setTyping: vi.fn(),
    setPresence: vi.fn(),
    getCurrentRoomMessages: vi.fn(),
    getUnreadCount: vi.fn(),
  }),
}));

describe('Messaging Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders messaging interface', () => {
    render(<Messaging />);
    
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useMessagingStore).mockReturnValue({
      messages: {},
      rooms: [],
      roomsLoading: true,
      roomsError: null,
      currentRoom: null,
      onlineUsers: [],
      typingUsers: [],
      fetchRooms: vi.fn(),
      createRoom: vi.fn(),
      joinRoom: vi.fn(),
      leaveRoom: vi.fn(),
      fetchMessages: vi.fn(),
      sendMessage: vi.fn(),
      editMessage: vi.fn(),
      deleteMessage: vi.fn(),
      addReaction: vi.fn(),
      removeReaction: vi.fn(),
      setTyping: vi.fn(),
      setPresence: vi.fn(),
      getCurrentRoomMessages: vi.fn(),
      getUnreadCount: vi.fn(),
    });

    render(<Messaging />);
    
    expect(screen.getByText('Loading chat rooms...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useMessagingStore).mockReturnValue({
      messages: {},
      rooms: [],
      roomsLoading: false,
      roomsError: 'Failed to load chat rooms',
      currentRoom: null,
      onlineUsers: [],
      typingUsers: [],
      fetchRooms: vi.fn(),
      createRoom: vi.fn(),
      joinRoom: vi.fn(),
      leaveRoom: vi.fn(),
      fetchMessages: vi.fn(),
      sendMessage: vi.fn(),
      editMessage: vi.fn(),
      deleteMessage: vi.fn(),
      addReaction: vi.fn(),
      removeReaction: vi.fn(),
      setTyping: vi.fn(),
      setPresence: vi.fn(),
      getCurrentRoomMessages: vi.fn(),
      getUnreadCount: vi.fn(),
    });

    render(<Messaging />);
    
    expect(screen.getByText('Error loading chat rooms: Failed to load chat rooms')).toBeInTheDocument();
  });
});
