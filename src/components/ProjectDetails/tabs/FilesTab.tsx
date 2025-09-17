import React from 'react';
import Files from '../../pages/Files';

interface FilesTabProps {
  projectId?: string;
}

const FilesTab: React.FC<FilesTabProps> = ({ projectId }) => {
  return (
    <div className="files-tab">
      <Files />
    </div>
  );
};

export default FilesTab;
