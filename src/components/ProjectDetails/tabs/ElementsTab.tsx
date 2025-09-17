import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select,
  InputNumber,
  Upload,
  message,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  AppstoreOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  DragOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface ElementsTabProps {
  projectId?: string;
}

interface Element {
  id: string;
  name: string;
  type: 'structure' | 'decoration' | 'lighting' | 'multimedia' | 'interactive';
  dimensions: string;
  material: string;
  quantity: number;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: string;
  progress: number;
  notes: string;
}

const ElementsTab: React.FC<ElementsTabProps> = ({ projectId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const elements: Element[] = [
    {
      id: '1',
      name: 'Główna konstrukcja wystawowa',
      type: 'structure',
      dimensions: '300x200x250 cm',
      material: 'Płyta MDF 18mm',
      quantity: 1,
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'Jan Kowalski',
      dueDate: '2025-02-15',
      progress: 65,
      notes: 'Konstrukcja z możliwością demontażu',
    },
    {
      id: '2',
      name: 'Panel interaktywny dotykowy',
      type: 'interactive',
      dimensions: '120x80 cm',
      material: 'Szkło hartowane + elektronika',
      quantity: 2,
      status: 'planned',
      priority: 'high',
      assignedTo: 'Anna Nowak',
      dueDate: '2025-03-01',
      progress: 0,
      notes: 'Panel z aplikacją edukacyjną',
    },
    {
      id: '3',
      name: 'Oświetlenie LED RGB',
      type: 'lighting',
      dimensions: '500x30 cm',
      material: 'Taśma LED + zasilacz',
      quantity: 10,
      status: 'completed',
      priority: 'medium',
      assignedTo: 'Piotr Wiśniewski',
      dueDate: '2025-01-20',
      progress: 100,
      notes: 'Oświetlenie z możliwością zmiany kolorów',
    },
    {
      id: '4',
      name: 'Dekoracje ścienne',
      type: 'decoration',
      dimensions: '200x150 cm',
      material: 'Farba akrylowa + szablony',
      quantity: 4,
      status: 'on_hold',
      priority: 'low',
      assignedTo: 'Maria Kowalczyk',
      dueDate: '2025-02-28',
      progress: 30,
      notes: 'Czeka na zatwierdzenie wzoru',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'structure': return 'blue';
      case 'decoration': return 'green';
      case 'lighting': return 'orange';
      case 'multimedia': return 'purple';
      case 'interactive': return 'red';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'structure': return 'Konstrukcja';
      case 'decoration': return 'Dekoracja';
      case 'lighting': return 'Oświetlenie';
      case 'multimedia': return 'Multimedia';
      case 'interactive': return 'Interaktywne';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'planned': return 'orange';
      case 'on_hold': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ukończone';
      case 'in_progress': return 'W trakcie';
      case 'planned': return 'Zaplanowane';
      case 'on_hold': return 'Wstrzymane';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const totalElements = elements.length;
  const completedElements = elements.filter(el => el.status === 'completed').length;
  const inProgressElements = elements.filter(el => el.status === 'in_progress').length;
  const plannedElements = elements.filter(el => el.status === 'planned').length;
  const onHoldElements = elements.filter(el => el.status === 'on_hold').length;

  const handleAddElement = () => {
    setSelectedElement(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditElement = (element: Element) => {
    setSelectedElement(element);
    form.setFieldsValue(element);
    setIsModalVisible(true);
  };

  const handleDeleteElement = (elementId: string) => {
    Modal.confirm({
      title: 'Usunąć element?',
      content: 'Czy na pewno chcesz usunąć ten element?',
      onOk() {
        message.success('Element został usunięty');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (selectedElement) {
        message.success('Element został zaktualizowany');
      } else {
        message.success('Nowy element został dodany');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Nazwa elementu',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Element) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.dimensions}</div>
        </div>
      ),
    },
    {
      title: 'Typ',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {getTypeText(type)}
        </Tag>
      ),
    },
    {
      title: 'Materiał',
      dataIndex: 'material',
      key: 'material',
    },
    {
      title: 'Ilość',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Element) => (
        <div>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {record.progress > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {record.progress}% ukończone
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Priorytet',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Przypisane do',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Termin',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Akcje',
      key: 'actions',
      render: (_: any, record: Element) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            size="small"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditElement(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteElement(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="elements-tab p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Elementy projektu</h2>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddElement}
            >
              Dodaj element
            </Button>
            <Button icon={<DragOutlined />}>
              Zarządzaj kolejnością
            </Button>
            <Button icon={<UploadOutlined />}>
              Import z pliku
            </Button>
          </Space>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Wszystkie elementy"
              value={totalElements}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ukończone"
              value={completedElements}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="W trakcie"
              value={inProgressElements}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Zaplanowane"
              value={plannedElements}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Elements Table */}
      <Card title="Lista elementów">
        <Table
          columns={columns}
          dataSource={elements}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={selectedElement ? 'Edytuj element' : 'Nowy element'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nazwa elementu"
            rules={[{ required: true, message: 'Podaj nazwę elementu' }]}
          >
            <Input placeholder="Wprowadź nazwę elementu" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Typ elementu"
                rules={[{ required: true, message: 'Wybierz typ elementu' }]}
              >
                <Select placeholder="Wybierz typ">
                  <Option value="structure">Konstrukcja</Option>
                  <Option value="decoration">Dekoracja</Option>
                  <Option value="lighting">Oświetlenie</Option>
                  <Option value="multimedia">Multimedia</Option>
                  <Option value="interactive">Interaktywne</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priorytet"
                rules={[{ required: true, message: 'Wybierz priorytet' }]}
              >
                <Select placeholder="Wybierz priorytet">
                  <Option value="low">Niski</Option>
                  <Option value="medium">Średni</Option>
                  <Option value="high">Wysoki</Option>
                  <Option value="urgent">Pilny</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dimensions"
                label="Wymiary"
                rules={[{ required: true, message: 'Podaj wymiary' }]}
              >
                <Input placeholder="np. 300x200x250 cm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="material"
                label="Materiał"
                rules={[{ required: true, message: 'Podaj materiał' }]}
              >
                <Input placeholder="Wprowadź materiał" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="quantity"
                label="Ilość"
                rules={[{ required: true, message: 'Podaj ilość' }]}
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Wybierz status' }]}
              >
                <Select placeholder="Wybierz status">
                  <Option value="planned">Zaplanowane</Option>
                  <Option value="in_progress">W trakcie</Option>
                  <Option value="completed">Ukończone</Option>
                  <Option value="on_hold">Wstrzymane</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="progress"
                label="Postęp (%)"
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignedTo"
                label="Przypisane do"
                rules={[{ required: true, message: 'Podaj osobę odpowiedzialną' }]}
              >
                <Input placeholder="Wprowadź imię i nazwisko" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Termin"
                rules={[{ required: true, message: 'Podaj termin' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="notes"
            label="Notatki"
          >
            <TextArea 
              rows={3} 
              placeholder="Dodatkowe informacje o elemencie"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ElementsTab;
