import React from 'react';
import Logistics from '../../pages/Logistics';

interface LogisticsTabProps {
  projectId?: string;
}

const LogisticsTab: React.FC<LogisticsTabProps> = ({ projectId }) => {
  return (
    <div className="logistics-tab">
      <Logistics />
    </div>
  );
};

export default LogisticsTab;
