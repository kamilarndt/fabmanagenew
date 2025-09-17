import React from 'react';
import Concepts from '../../pages/Concepts';

interface ConceptTabProps {
  projectId?: string;
}

const ConceptTab: React.FC<ConceptTabProps> = ({ projectId }) => {
  return (
    <div className="concept-tab">
      <Concepts />
    </div>
  );
};

export default ConceptTab;
