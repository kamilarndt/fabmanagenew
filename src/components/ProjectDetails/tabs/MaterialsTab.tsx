import React from 'react';
import Materials from '../../pages/Materials';

interface MaterialsTabProps {
  projectId?: string;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ projectId }) => {
  return (
    <div className="materials-tab">
      <Materials />
    </div>
  );
};

export default MaterialsTab;
