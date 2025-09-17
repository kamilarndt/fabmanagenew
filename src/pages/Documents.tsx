import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Input, Select, Modal, Form, message, Space, Tag, Tree, Tooltip, Statistic, Progress } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CopyOutlined, ShareAltOutlined, FolderOutlined, FileTextOutlined, HistoryOutlined, CommentOutlined, BookOutlined } from '@ant-design/icons';
import { useDocumentsStore } from '../stores/documentsStore';
import { Document, DocumentCategory, DocumentTemplate, DocumentVersion, DocumentComment } from '../types/documents.types';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [form] = Form.useForm();
  
  const {
    documents,
    categories,
    templates,
    versions,
    comments,
    isLoading,
    error,
    fetchDocuments,
    fetchCategories,
    fetchTemplates,
    addDocument,
    addCategory,
    addTemplate,
    updateDocument,
    updateCategory,
    updateTemplate,
    deleteDocument,
    deleteCategory,
    deleteTemplate,
    fetchVersions,
    fetchComments,
    addComment,
    publishDocument,
    archiveDocument,
    duplicateDocument,
    getDocumentStats,
  } = useDocumentsStore();
  
  useEffect(() => {
    fetchDocuments();
    fetchCategories();
    fetchTemplates();
  }, [fetchDocuments, fetchCategories, fetchTemplates]);
  
  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  
  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue(item);
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
        const updateFn = activeTab === 'documents' ? updateDocument : 
                        activeTab === 'categories' ? updateCategory : updateTemplate;
        await updateFn(editingItem.id, values);
        message.success('Item updated successfully');
      } else {
        const addFn = activeTab === 'documents' ? addDocument : 
                     activeTab === 'categories' ? addCategory : addTemplate;
        await addFn(values);
        message.success('Item added successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save item');
    }
  };
  
  const handleViewDetails = async (document: Document) => {
    setSelectedDocument(document);
    await fetchVersions(document.id);
    await fetchComments(document.id);
  };
  
  const handlePublish = async (document: Document) => {
    try {
      await publishDocument(document.id);
      message.success('Document published successfully');
    } catch (error) {
      message.error('Failed to publish document');
    }
  };
  
  const handleArchive = async (document: Document) => {
    try {
      await archiveDocument(document.id);
      message.success('Document archived successfully');
    } catch (error) {
      message.error('Failed to archive document');
    }
  };
  
  const handleDuplicate = async (document: Document) => {
    try {
      await duplicateDocument(document.id);
      message.success('Document duplicated successfully');
    } catch (error) {
      message.error('Failed to duplicate document');
    }
  };
  
  const handleAddComment = async (content: string) => {
    if (!selectedDocument) return;
    
    try {
      await addComment({
        document_id: selectedDocument.id,
        author_id: 'current-user',
        author_name: 'Current User',
        content,
      });
      message.success('Comment added');
    } catch (error) {
      message.error('Failed to add comment');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'review':
        return 'orange';
      case 'approved':
        return 'blue';
      case 'published':
        return 'green';
      case 'archived':
        return 'gray';
      default:
        return 'default';
    }
  };
  
  const documentColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (title: string, record: Document) => (
        <Space>
          <FileTextOutlined />
          <span>{title}</span>
          {record.is_public && <Tag color="blue">Public</Tag>}
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 80,
    },
    {
      title: 'Views',
      dataIndex: 'view_count',
      key: 'view_count',
      width: 80,
    },
    {
      title: 'Downloads',
      dataIndex: 'download_count',
      key: 'download_count',
      width: 100,
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
      width: 200,
      render: (_: any, record: Document) => (
        <Space>
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button type="text" icon={<CopyOutlined />} onClick={() => handleDuplicate(record)} />
          </Tooltip>
          {record.status === 'draft' && (
            <Tooltip title="Publish">
              <Button type="text" onClick={() => handlePublish(record)}>Publish</Button>
            </Tooltip>
          )}
          {record.status === 'published' && (
            <Tooltip title="Archive">
              <Button type="text" onClick={() => handleArchive(record)}>Archive</Button>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record, deleteDocument)} />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: DocumentCategory) => (
        <Space>
          <span style={{ color: record.color }}>{record.icon}</span>
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
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
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: DocumentCategory) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record, deleteCategory)} />
        </Space>
      ),
    },
  ];
  
  const templateColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      width: 150,
      render: (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
      },
    },
    {
      title: 'Variables',
      dataIndex: 'variables',
      key: 'variables',
      width: 200,
      render: (variables: string[]) => (
        <Space wrap>
          {variables.map((variable, index) => (
            <Tag key={index}>{variable}</Tag>
          ))}
        </Space>
      ),
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
      render: (_: any, record: DocumentTemplate) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record, deleteTemplate)} />
        </Space>
      ),
    },
  ];
  
  const getCurrentData = () => {
    switch (activeTab) {
      case 'documents':
        return filteredDocuments;
      case 'categories':
        return categories;
      case 'templates':
        return templates;
      default:
        return [];
    }
  };
  
  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'documents':
        return documentColumns;
      case 'categories':
        return categoryColumns;
      case 'templates':
        return templateColumns;
      default:
        return [];
    }
  };
  
  const stats = getDocumentStats();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading documents: {error}</p>
          <Button onClick={() => fetchDocuments()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add {activeTab === 'documents' ? 'Document' : activeTab === 'categories' ? 'Category' : 'Template'}
        </Button>
      </div>
      
      {/* Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Documents"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Published"
              value={stats.published}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Drafts"
              value={stats.draft}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Archived"
              value={stats.archived}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
      
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
            type={activeTab === 'documents' ? 'primary' : 'default'}
            icon={<FileTextOutlined />}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </Button>
          <Button
            type={activeTab === 'categories' ? 'primary' : 'default'}
            icon={<FolderOutlined />}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </Button>
          <Button
            type={activeTab === 'templates' ? 'primary' : 'default'}
            icon={<BookOutlined />}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </Button>
        </Space>
      </div>
      
      <Table
        columns={getCurrentColumns()}
        dataSource={getCurrentData()}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
      />
      
      <Modal
        title={`${editingItem ? 'Edit' : 'Add'} ${activeTab === 'documents' ? 'Document' : activeTab === 'categories' ? 'Category' : 'Template'}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {activeTab === 'documents' && (
            <>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input placeholder="e.g., Project Requirements" />
              </Form.Item>
              <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                <TextArea rows={6} placeholder="Document content" />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  {categories.map(category => (
                    <Option key={category.id} value={category.name}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="subcategory" label="Subcategory">
                <Input placeholder="e.g., Technical Specifications" />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value="draft">Draft</Option>
                  <Option value="review">Review</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="published">Published</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Add tags">
                  <Option value="important">Important</Option>
                  <Option value="technical">Technical</Option>
                  <Option value="user-guide">User Guide</Option>
                  <Option value="api">API</Option>
                </Select>
              </Form.Item>
              <Form.Item name="is_public" label="Public" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'categories' && (
            <>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Technical Documentation" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={3} placeholder="Category description" />
              </Form.Item>
              <Form.Item name="color" label="Color" rules={[{ required: true }]}>
                <Input type="color" />
              </Form.Item>
              <Form.Item name="icon" label="Icon" rules={[{ required: true }]}>
                <Input placeholder="e.g., 📄" />
              </Form.Item>
              <Form.Item name="is_active" label="Active" valuePropName="checked">
                <input type="checkbox" defaultChecked />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'templates' && (
            <>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Project Proposal Template" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={3} placeholder="Template description" />
              </Form.Item>
              <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                <TextArea rows={6} placeholder="Template content" />
              </Form.Item>
              <Form.Item name="variables" label="Variables">
                <Select mode="tags" placeholder="Add variables">
                  <Option value="{{project_name}}">Project Name</Option>
                  <Option value="{{date}}">Date</Option>
                  <Option value="{{author}}">Author</Option>
                </Select>
              </Form.Item>
              <Form.Item name="is_active" label="Active" valuePropName="checked">
                <input type="checkbox" defaultChecked />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      
      <Modal
        title="Document Details"
        open={!!selectedDocument}
        onCancel={() => setSelectedDocument(null)}
        footer={null}
        width={800}
      >
        {selectedDocument && (
          <div className="space-y-6">
            <Card title="Document Information">
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>Title:</strong> {selectedDocument.title}</p>
                  <p><strong>Category:</strong> <Tag>{selectedDocument.category}</Tag></p>
                  <p><strong>Status:</strong> <Tag color={getStatusColor(selectedDocument.status)}>{selectedDocument.status}</Tag></p>
                  <p><strong>Version:</strong> {selectedDocument.version}</p>
                </Col>
                <Col span={12}>
                  <p><strong>Views:</strong> {selectedDocument.view_count}</p>
                  <p><strong>Downloads:</strong> {selectedDocument.download_count}</p>
                  <p><strong>Created:</strong> {new Date(selectedDocument.created_at).toLocaleDateString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedDocument.updated_at).toLocaleDateString()}</p>
                </Col>
              </Row>
              <div className="mt-4">
                <p><strong>Content:</strong></p>
                <div className="bg-gray-50 p-4 rounded">
                  <pre className="whitespace-pre-wrap">{selectedDocument.content}</pre>
                </div>
              </div>
              {selectedDocument.tags.length > 0 && (
                <div className="mt-4">
                  <p><strong>Tags:</strong></p>
                  <Space wrap>
                    {selectedDocument.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Card>
            
            <Card title="Versions">
              <div className="space-y-2">
                {versions.map((version) => (
                  <div key={version.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <span className="font-medium">Version {version.version_number}</span>
                      <span className="text-gray-500 ml-2">{version.changes}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(version.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card title="Comments">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{comment.author_name}</span>
                        <span className="text-gray-500 ml-2">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                ))}
                <div className="mt-4">
                  <TextArea
                    placeholder="Add a comment..."
                    rows={3}
                    onPressEnter={(e) => {
                      if (e.currentTarget.value.trim()) {
                        handleAddComment(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Documents;
