import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Input, Select, Modal, Form, InputNumber, message, Space, Tag, Progress, Steps, Timeline, Avatar } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, MessageOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useConceptStore } from '../stores/conceptStore';
import { Concept, ConceptApproval, ConceptComment } from '../types/concept.types';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const Concepts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [activeTab, setActiveTab] = useState('concepts');
  const [form] = Form.useForm();
  
  const {
    concepts,
    approvals,
    comments,
    isLoading,
    error,
    fetchConcepts,
    addConcept,
    updateConcept,
    deleteConcept,
    submitConcept,
    approveConcept,
    rejectConcept,
    fetchApprovals,
    fetchComments,
    addComment,
    getApprovalProgress,
  } = useConceptStore();
  
  useEffect(() => {
    fetchConcepts();
  }, [fetchConcepts]);
  
  const filteredConcepts = concepts.filter(concept =>
    concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAdd = () => {
    setEditingConcept(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  
  const handleEdit = (concept: Concept) => {
    setEditingConcept(concept);
    form.setFieldsValue(concept);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (concept: Concept) => {
    try {
      await deleteConcept(concept.id);
      message.success('Concept deleted successfully');
    } catch (error) {
      message.error('Failed to delete concept');
    }
  };
  
  const handleSubmit = async (values: any) => {
    try {
      if (editingConcept) {
        await updateConcept(editingConcept.id, values);
        message.success('Concept updated successfully');
      } else {
        await addConcept(values);
        message.success('Concept added successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save concept');
    }
  };
  
  const handleSubmitConcept = async (concept: Concept) => {
    try {
      await submitConcept(concept.id);
      message.success('Concept submitted for approval');
    } catch (error) {
      message.error('Failed to submit concept');
    }
  };
  
  const handleApprove = async (concept: Concept) => {
    try {
      await approveConcept(concept.id, 'current-user', 'Approved');
      message.success('Concept approved');
    } catch (error) {
      message.error('Failed to approve concept');
    }
  };
  
  const handleReject = async (concept: Concept) => {
    try {
      await rejectConcept(concept.id, 'current-user', 'Rejected');
      message.success('Concept rejected');
    } catch (error) {
      message.error('Failed to reject concept');
    }
  };
  
  const handleViewDetails = async (concept: Concept) => {
    setSelectedConcept(concept);
    await fetchApprovals(concept.id);
    await fetchComments(concept.id);
  };
  
  const handleAddComment = async (content: string) => {
    if (!selectedConcept) return;
    
    try {
      await addComment({
        concept_id: selectedConcept.id,
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
      case 'submitted':
        return 'blue';
      case 'under_review':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'archived':
        return 'gray';
      default:
        return 'default';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'blue';
      case 'high':
        return 'orange';
      case 'urgent':
        return 'red';
      default:
        return 'default';
    }
  };
  
  const conceptColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Estimated Cost',
      dataIndex: 'estimated_cost',
      key: 'estimated_cost',
      width: 120,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: 'Duration (days)',
      dataIndex: 'estimated_duration',
      key: 'estimated_duration',
      width: 120,
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
      render: (_: any, record: Concept) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          {record.status === 'draft' && (
            <Button type="text" onClick={() => handleSubmitConcept(record)}>Submit</Button>
          )}
          {record.status === 'submitted' && (
            <>
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleApprove(record)}>Approve</Button>
              <Button type="text" icon={<CloseOutlined />} onClick={() => handleReject(record)}>Reject</Button>
            </>
          )}
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading concepts...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading concepts: {error}</p>
          <Button onClick={() => fetchConcepts()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Concept Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Concept
        </Button>
      </div>
      
      <div className="mb-4">
        <Search
          placeholder="Search concepts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      
      <Table
        columns={conceptColumns}
        dataSource={filteredConcepts}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
      />
      
      <Modal
        title={editingConcept ? 'Edit Concept' : 'Add Concept'}
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
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="e.g., New Design Concept" />
          </Form.Item>
          
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Describe the concept" />
          </Form.Item>
          
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Option value="design">Design</Option>
              <Option value="engineering">Engineering</Option>
              <Option value="logistics">Logistics</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="estimated_cost" label="Estimated Cost" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="estimated_duration" label="Estimated Duration (days)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags">
              <Option value="innovation">Innovation</Option>
              <Option value="cost-effective">Cost Effective</Option>
              <Option value="sustainable">Sustainable</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Additional notes" />
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="Concept Details"
        open={!!selectedConcept}
        onCancel={() => setSelectedConcept(null)}
        footer={null}
        width={800}
      >
        {selectedConcept && (
          <div className="space-y-6">
            <Card title="Concept Information">
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>Title:</strong> {selectedConcept.title}</p>
                  <p><strong>Category:</strong> <Tag>{selectedConcept.category}</Tag></p>
                  <p><strong>Priority:</strong> <Tag color={getPriorityColor(selectedConcept.priority)}>{selectedConcept.priority}</Tag></p>
                  <p><strong>Status:</strong> <Tag color={getStatusColor(selectedConcept.status)}>{selectedConcept.status}</Tag></p>
                </Col>
                <Col span={12}>
                  <p><strong>Estimated Cost:</strong> ${selectedConcept.estimated_cost.toFixed(2)}</p>
                  <p><strong>Duration:</strong> {selectedConcept.estimated_duration} days</p>
                  <p><strong>Created:</strong> {new Date(selectedConcept.created_at).toLocaleDateString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedConcept.updated_at).toLocaleDateString()}</p>
                </Col>
              </Row>
              <div className="mt-4">
                <p><strong>Description:</strong></p>
                <p>{selectedConcept.description}</p>
              </div>
              {selectedConcept.tags.length > 0 && (
                <div className="mt-4">
                  <p><strong>Tags:</strong></p>
                  <Space wrap>
                    {selectedConcept.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Card>
            
            <Card title="Approval Progress">
              <Progress
                percent={getApprovalProgress(selectedConcept.id).percentage}
                status={selectedConcept.status === 'rejected' ? 'exception' : 'active'}
              />
              <div className="mt-4">
                <Steps
                  current={approvals.filter(a => a.status !== 'pending').length}
                  size="small"
                >
                  {approvals.map((approval, index) => (
                    <Step
                      key={approval.id}
                      title={approval.approver_name}
                      status={approval.status === 'approved' ? 'finish' : approval.status === 'rejected' ? 'error' : 'wait'}
                    />
                  ))}
                </Steps>
              </div>
            </Card>
            
            <Card title="Comments">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <Avatar icon={<UserOutlined />} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{comment.author_name}</span>
                          <span className="text-gray-500 text-sm">{new Date(comment.created_at).toLocaleString()}</span>
                        </div>
                        <div className="text-gray-700">{comment.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-start space-x-3">
                  <Avatar icon={<UserOutlined />} />
                  <div className="flex-1">
                    <Input
                      placeholder="Add a comment..."
                      onPressEnter={(e) => {
                        if (e.currentTarget.value.trim()) {
                          handleAddComment(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Concepts;
