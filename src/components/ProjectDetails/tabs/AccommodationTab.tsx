import React from 'react';
import Accommodation from '../../pages/Accommodation';

interface AccommodationTabProps {
  projectId?: string;
}

const AccommodationTab: React.FC<AccommodationTabProps> = ({ projectId }) => {
  return (
    <div className="accommodation-tab">
      <Accommodation />
    </div>
  );
};

export default AccommodationTab;
