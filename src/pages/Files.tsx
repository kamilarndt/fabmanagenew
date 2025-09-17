import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Table, Button, Input, Select, Modal, Form, message, Space, Tag, Upload, Tree, Tooltip, Progress } from 'antd';
import { PlusOutlined, SearchOutlined, UploadOutlined, DownloadOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, FolderOutlined, FileOutlined, HistoryOutlined } from '@ant-design/icons';
import { useFilesStore } from '../stores/filesStore';
import { FileItem, Folder, FileVersion, FileShare } from '../types/files.types';

const { Search } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const Files: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('files');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    files,
    folders,
    versions,
    shares,
    currentFolder,
    selectedFiles,
    isLoading,
    error,
    fetchFiles,
    fetchFolders,
    uploadFile,
    deleteFile,
    moveFile,
    renameFile,
    createFolder,
    deleteFolder,
    moveFolder,
    renameFolder,
    fetchVersions,
    createVersion,
    deleteVersion,
    restoreVersion,
    shareFile,
    unshareFile,
    updateSharePermission,
    searchFiles,
    downloadFile,
    previewFile,
    setCurrentFolder,
    setSelectedFiles,
    toggleFileSelection,
  } = useFilesStore();
  
  useEffect(() => {
    fetchFiles(currentFolder);
    fetchFolders(currentFolder);
  }, [fetchFiles, fetchFolders, currentFolder]);
  
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (item: any, deleteFn: (id: string) => Promise<void>) => {
    try {
      await deleteFn(item.id);
      message.success('Item deleted successfully');
    } catch (error) {
      message.error('Failed to delete item');
    }
  };
  
  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        const updateFn = activeTab === 'files' ? renameFile : 
                        activeTab === 'folders' ? renameFolder : 
                        activeTab === 'versions' ? deleteVersion : unshareFile;
        await updateFn(editingItem.id, values);
        message.success('Item updated successfully');
      } else {
        const addFn = activeTab === 'files' ? uploadFile : 
                     activeTab === 'folders' ? createFolder : 
                     activeTab === 'versions' ? createVersion : shareFile;
        await addFn(values);
        message.success('Item added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error('Failed to save item');
    }
  };
  
  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadData = {
        file,
        folder_id: currentFolder,
        description: '',
        tags: [],
        is_public: false,
      };
      
      await uploadFile(uploadData);
      message.success('File uploaded successfully');
    } catch (error) {
      message.error('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDownload = async (file: FileItem) => {
    try {
      await downloadFile(file.id);
    } catch (error) {
      message.error('Failed to download file');
    }
  };
  
  const handlePreview = async (file: FileItem) => {
    try {
      const previewUrl = await previewFile(file.id);
      window.open(previewUrl, '_blank');
    } catch (error) {
      message.error('Failed to preview file');
    }
  };
  
  const handleShare = async (file: FileItem) => {
    try {
      const shareData = {
        file_id: file.id,
        shared_by: 'current-user', // TODO: Get from auth context
        shared_with: 'user@example.com', // TODO: Get from form
        permission: 'read' as const,
        is_active: true,
      };
      
      await shareFile(file.id, shareData);
      message.success('File shared successfully');
    } catch (error) {
      message.error('Failed to share file');
    }
  };
  
  const handleVersionRestore = async (version: FileVersion) => {
    try {
      await restoreVersion(version.id);
      message.success('Version restored successfully');
    } catch (error) {
      message.error('Failed to restore version');
    }
  };
  
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel')) return '📊';
    if (mimeType.includes('powerpoint')) return '📈';
    return '📁';
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const fileColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name: string, record: FileItem) => (
        <Space>
          <span>{getFileIcon(record.mime_type)}</span>
          <span>{name}</span>
          {record.is_public && <Tag color="blue">Public</Tag>}
        </Space>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Type',
      dataIndex: 'mime_type',
      key: 'mime_type',
      width: 120,
      render: (mimeType: string) => mimeType.split('/')[1]?.toUpperCase() || 'Unknown',
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Downloads',
      dataIndex: 'download_count',
      key: 'download_count',
      width: 100,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: any, record: FileItem) => (
        <Space>
          <Tooltip title="Preview">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(record)} />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<DownloadOutlined />} onClick={() => handleDownload(record)} />
          </Tooltip>
          <Tooltip title="Share">
            <Button type="text" icon={<ShareAltOutlined />} onClick={() => handleShare(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record, deleteFile)} />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  const folderColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name: string, record: Folder) => (
        <Space>
          <FolderOutlined />
          <span>{name}</span>
          {record.is_public && <Tag color="blue">Public</Tag>}
        </Space>
      ),
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      width: 200,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Folder) => (
        <Space>
          <Button type="text" onClick={() => setCurrentFolder(record.id)}>Open</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record, deleteFolder)} />
        </Space>
      ),
    },
  ];
  
  const versionColumns = [
    {
      title: 'Version',
      dataIndex: 'version_number',
      key: 'version_number',
      width: 100,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploaded_by',
      key: 'uploaded_by',
      width: 150,
    },
    {
      title: 'Uploaded At',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Description',
      dataIndex: 'change_description',
      key: 'change_description',
      width: 200,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: FileVersion) => (
        <Space>
          <Button type="text" onClick={() => handleVersionRestore(record)}>Restore</Button>
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record, deleteVersion)} />
        </Space>
      ),
    },
  ];
  
  const shareColumns = [
    {
      title: 'File',
      dataIndex: 'file_id',
      key: 'file_id',
      width: 200,
      render: (fileId: string) => {
        const file = files.find(f => f.id === fileId);
        return file ? file.name : 'Unknown';
      },
    },
    {
      title: 'Shared With',
      dataIndex: 'shared_with',
      key: 'shared_with',
      width: 150,
    },
    {
      title: 'Permission',
      dataIndex: 'permission',
      key: 'permission',
      width: 100,
      render: (permission: string) => <Tag color="blue">{permission}</Tag>,
    },
    {
      title: 'Expires',
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: FileShare) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record, unshareFile)} />
        </Space>
      ),
    },
  ];
  
  const getCurrentData = () => {
    switch (activeTab) {
      case 'files':
        return files;
      case 'folders':
        return folders;
      case 'versions':
        return versions;
      case 'shares':
        return shares;
      default:
        return [];
    }
  };
  
  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'files':
        return fileColumns;
      case 'folders':
        return folderColumns;
      case 'versions':
        return versionColumns;
      case 'shares':
        return shareColumns;
      default:
        return [];
    }
  };
  
  const filteredData = getCurrentData().filter((item: any) =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading files: {error}</p>
          <Button onClick={() => fetchFiles(currentFolder)} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">File Management</h1>
        <Space>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
          >
            Upload File
          </Button>
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            New Folder
          </Button>
        </Space>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      
      {uploading && (
        <Card className="mb-4">
          <Progress percent={uploadProgress} status="active" />
        </Card>
      )}
      
      <div className="mb-4">
        <Search
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      
      {/* Tabs */}
      <div className="mb-4">
        <Space>
          <Button
            type={activeTab === 'files' ? 'primary' : 'default'}
            icon={<FileOutlined />}
            onClick={() => setActiveTab('files')}
          >
            Files
          </Button>
          <Button
            type={activeTab === 'folders' ? 'primary' : 'default'}
            icon={<FolderOutlined />}
            onClick={() => setActiveTab('folders')}
          >
            Folders
          </Button>
          <Button
            type={activeTab === 'versions' ? 'primary' : 'default'}
            icon={<HistoryOutlined />}
            onClick={() => setActiveTab('versions')}
          >
            Versions
          </Button>
          <Button
            type={activeTab === 'shares' ? 'primary' : 'default'}
            icon={<ShareAltOutlined />}
            onClick={() => setActiveTab('shares')}
          >
            Shares
          </Button>
        </Space>
      </div>
      
      <Table
        columns={getCurrentColumns()}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
        rowSelection={activeTab === 'files' ? {
          selectedRowKeys: selectedFiles,
          onChange: setSelectedFiles,
        } : undefined}
      />
      
      <Modal
        title={`${editingItem ? 'Edit' : 'Add'} ${activeTab === 'files' ? 'File' : activeTab === 'folders' ? 'Folder' : activeTab === 'versions' ? 'Version' : 'Share'}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
        width={600}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          {activeTab === 'folders' && (
            <>
              <Form.Item name="name" label="Folder Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Project Documents" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} placeholder="Folder description" />
              </Form.Item>
              <Form.Item name="is_public" label="Public" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'shares' && (
            <>
              <Form.Item name="file_id" label="File" rules={[{ required: true }]}>
                <Select>
                  {files.map(file => (
                    <Option key={file.id} value={file.id}>{file.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="shared_with" label="Shared With" rules={[{ required: true }]}>
                <Input placeholder="e.g., user@example.com" />
              </Form.Item>
              <Form.Item name="permission" label="Permission" rules={[{ required: true }]}>
                <Select>
                  <Option value="read">Read</Option>
                  <Option value="write">Write</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
              <Form.Item name="expires_at" label="Expires At">
                <Input type="date" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Files;
