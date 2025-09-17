import React from 'react';
import Documents from '../../pages/Documents';

interface DocumentsTabProps {
  projectId?: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ projectId }) => {
  return (
    <div className="documents-tab">
      <Documents />
    </div>
  );
};

export default DocumentsTab;
