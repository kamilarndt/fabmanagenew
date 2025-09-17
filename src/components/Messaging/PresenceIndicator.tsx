import React from 'react';
import { Avatar, Tooltip, Badge } from 'antd';
import { PresenceUser } from '../../types/messaging.types';

interface PresenceIndicatorProps {
  users: PresenceUser[];
  maxVisible?: number;
  showTooltip?: boolean;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  users,
  maxVisible = 5,
  showTooltip = true,
}) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#52c41a';
      case 'away':
        return '#faad14';
      case 'busy':
        return '#ff4d4f';
      case 'offline':
      default:
        return '#d9d9d9';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
      default:
        return 'Offline';
    }
  };
  
  const renderUser = (user: PresenceUser) => {
    const avatar = (
      <Badge
        dot
        color={getStatusColor(user.status)}
        offset={[-2, 2]}
      >
        <Avatar
          size="small"
          src={user.avatar_url}
          className="border-2 border-white"
        >
          {user.name?.charAt(0)}
        </Avatar>
      </Badge>
    );
    
    if (showTooltip) {
      return (
        <Tooltip
          key={user.id}
          title={`${user.name} - ${getStatusText(user.status)}`}
          placement="top"
        >
          {avatar}
        </Tooltip>
      );
    }
    
    return <div key={user.id}>{avatar}</div>;
  };
  
  return (
    <div className="flex items-center space-x-1">
      {visibleUsers.map(renderUser)}
      {remainingCount > 0 && (
        <Tooltip
          title={`${remainingCount} more users`}
          placement="top"
        >
          <Avatar
            size="small"
            className="bg-gray-100 text-gray-600 border-2 border-white"
          >
            +{remainingCount}
          </Avatar>
        </Tooltip>
      )}
    </div>
  );
};
