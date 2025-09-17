import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Input, Select, Modal, Form, InputNumber, message, Space, Tag, Tabs } from 'antd';
import { PlusOutlined, SearchOutlined, TruckOutlined, UserOutlined, EnvironmentOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useLogisticsStore } from '../stores/logisticsStore';
import { TransportRoute, Vehicle, Driver, TransportJob } from '../types/logistics.types';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const Logistics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('routes');
  const [form] = Form.useForm();
  
  const {
    routes,
    vehicles,
    drivers,
    jobs,
    isLoading,
    error,
    fetchRoutes,
    fetchVehicles,
    fetchDrivers,
    fetchJobs,
    addRoute,
    addVehicle,
    addDriver,
    addJob,
    updateRoute,
    updateVehicle,
    updateDriver,
    updateJob,
    deleteRoute,
    deleteVehicle,
    deleteDriver,
    deleteJob,
  } = useLogisticsStore();
  
  useEffect(() => {
    fetchRoutes();
    fetchVehicles();
    fetchDrivers();
    fetchJobs();
  }, [fetchRoutes, fetchVehicles, fetchDrivers, fetchJobs]);
  
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
        const updateFn = activeTab === 'routes' ? updateRoute : 
                        activeTab === 'vehicles' ? updateVehicle :
                        activeTab === 'drivers' ? updateDriver : updateJob;
        await updateFn(editingItem.id, values);
        message.success('Item updated successfully');
      } else {
        const addFn = activeTab === 'routes' ? addRoute : 
                     activeTab === 'vehicles' ? addVehicle :
                     activeTab === 'drivers' ? addDriver : addJob;
        await addFn(values);
        message.success('Item added successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save item');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
      case 'scheduled':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'completed':
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };
  
  const routeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Origin',
      dataIndex: 'origin',
      key: 'origin',
      width: 120,
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
      width: 120,
    },
    {
      title: 'Distance (km)',
      dataIndex: 'distance',
      key: 'distance',
      width: 100,
    },
    {
      title: 'Duration (min)',
      dataIndex: 'estimated_duration',
      key: 'estimated_duration',
      width: 120,
    },
    {
      title: 'Cost/km',
      dataIndex: 'cost_per_km',
      key: 'cost_per_km',
      width: 100,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
      width: 100,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: TransportRoute) => (
        <Space>
          <Button type="text" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="text" danger onClick={() => handleDelete(record, deleteRoute)}>Delete</Button>
        </Space>
      ),
    },
  ];
  
  const vehicleColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (capacity: number) => `${capacity} m³`,
    },
    {
      title: 'Fuel Consumption',
      dataIndex: 'fuel_consumption',
      key: 'fuel_consumption',
      width: 120,
      render: (consumption: number) => `${consumption} L/100km`,
    },
    {
      title: 'Daily Rate',
      dataIndex: 'daily_rate',
      key: 'daily_rate',
      width: 100,
      render: (rate: number) => `$${rate.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'is_available',
      key: 'is_available',
      width: 100,
      render: (available: boolean) => (
        <Tag color={available ? 'green' : 'red'}>
          {available ? 'Available' : 'Unavailable'}
        </Tag>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'current_location',
      key: 'current_location',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Vehicle) => (
        <Space>
          <Button type="text" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="text" danger onClick={() => handleDelete(record, deleteVehicle)}>Delete</Button>
        </Space>
      ),
    },
  ];
  
  const driverColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'License Number',
      dataIndex: 'license_number',
      key: 'license_number',
      width: 120,
    },
    {
      title: 'License Type',
      dataIndex: 'license_type',
      key: 'license_type',
      width: 100,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating: number) => `${rating}/5`,
    },
    {
      title: 'Status',
      dataIndex: 'is_available',
      key: 'is_available',
      width: 100,
      render: (available: boolean) => (
        <Tag color={available ? 'green' : 'red'}>
          {available ? 'Available' : 'Unavailable'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Driver) => (
        <Space>
          <Button type="text" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="text" danger onClick={() => handleDelete(record, deleteDriver)}>Delete</Button>
        </Space>
      ),
    },
  ];
  
  const jobColumns = [
    {
      title: 'Project',
      dataIndex: 'project_id',
      key: 'project_id',
      width: 100,
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
      width: 150,
      render: (route: TransportRoute) => route?.name || 'N/A',
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
      width: 120,
      render: (vehicle: Vehicle) => vehicle?.name || 'N/A',
    },
    {
      title: 'Driver',
      dataIndex: 'driver',
      key: 'driver',
      width: 120,
      render: (driver: Driver) => driver?.name || 'N/A',
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo_description',
      key: 'cargo_description',
      width: 150,
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
    },
    {
      title: 'Volume (m³)',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
    },
    {
      title: 'Pickup Date',
      dataIndex: 'pickup_date',
      key: 'pickup_date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Delivery Date',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: TransportJob) => (
        <Space>
          <Button type="text" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="text" danger onClick={() => handleDelete(record, deleteJob)}>Delete</Button>
        </Space>
      ),
    },
  ];
  
  const getCurrentData = () => {
    switch (activeTab) {
      case 'routes':
        return routes;
      case 'vehicles':
        return vehicles;
      case 'drivers':
        return drivers;
      case 'jobs':
        return jobs;
      default:
        return [];
    }
  };
  
  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'routes':
        return routeColumns;
      case 'vehicles':
        return vehicleColumns;
      case 'drivers':
        return driverColumns;
      case 'jobs':
        return jobColumns;
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
          <p className="mt-2 text-gray-600">Loading logistics data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading logistics data: {error}</p>
          <Button onClick={() => {
            fetchRoutes();
            fetchVehicles();
            fetchDrivers();
            fetchJobs();
          }} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logistics Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add {activeTab === 'routes' ? 'Route' : activeTab === 'vehicles' ? 'Vehicle' : activeTab === 'drivers' ? 'Driver' : 'Job'}
        </Button>
      </div>
      
      <div className="mb-4">
        <Search
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><EnvironmentOutlined />Routes</span>} key="routes">
          <Table
            columns={routeColumns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            scroll={{ x: 1000 }}
          />
        </TabPane>
        <TabPane tab={<span><TruckOutlined />Vehicles</span>} key="vehicles">
          <Table
            columns={vehicleColumns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            scroll={{ x: 1000 }}
          />
        </TabPane>
        <TabPane tab={<span><UserOutlined />Drivers</span>} key="drivers">
          <Table
            columns={driverColumns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            scroll={{ x: 1000 }}
          />
        </TabPane>
        <TabPane tab={<span><CalculatorOutlined />Jobs</span>} key="jobs">
          <Table
            columns={jobColumns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            scroll={{ x: 1200 }}
          />
        </TabPane>
      </Tabs>
      
      <Modal
        title={`${editingItem ? 'Edit' : 'Add'} ${activeTab === 'routes' ? 'Route' : activeTab === 'vehicles' ? 'Vehicle' : activeTab === 'drivers' ? 'Driver' : 'Job'}`}
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
          {activeTab === 'routes' && (
            <>
              <Form.Item name="name" label="Route Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Warsaw to Krakow" />
              </Form.Item>
              <Form.Item name="origin" label="Origin" rules={[{ required: true }]}>
                <Input placeholder="e.g., Warsaw" />
              </Form.Item>
              <Form.Item name="destination" label="Destination" rules={[{ required: true }]}>
                <Input placeholder="e.g., Krakow" />
              </Form.Item>
              <Form.Item name="distance" label="Distance (km)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="estimated_duration" label="Estimated Duration (minutes)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="cost_per_km" label="Cost per km" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value="planned">Planned</Option>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </>
          )}
          
          {activeTab === 'vehicles' && (
            <>
              <Form.Item name="name" label="Vehicle Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Truck-001" />
              </Form.Item>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                <Select>
                  <Option value="truck">Truck</Option>
                  <Option value="van">Van</Option>
                  <Option value="car">Car</Option>
                  <Option value="trailer">Trailer</Option>
                </Select>
              </Form.Item>
              <Form.Item name="capacity" label="Capacity (m³)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="fuel_consumption" label="Fuel Consumption (L/100km)" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="daily_rate" label="Daily Rate" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="is_available" label="Available" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
              <Form.Item name="current_location" label="Current Location">
                <Input placeholder="e.g., Warehouse A" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'drivers' && (
            <>
              <Form.Item name="name" label="Driver Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., John Doe" />
              </Form.Item>
              <Form.Item name="license_number" label="License Number" rules={[{ required: true }]}>
                <Input placeholder="e.g., DL123456" />
              </Form.Item>
              <Form.Item name="license_type" label="License Type" rules={[{ required: true }]}>
                <Input placeholder="e.g., C+E" />
              </Form.Item>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input placeholder="e.g., +48 123 456 789" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input placeholder="e.g., john@example.com" />
              </Form.Item>
              <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="is_available" label="Available" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'jobs' && (
            <>
              <Form.Item name="project_id" label="Project ID" rules={[{ required: true }]}>
                <Input placeholder="e.g., PROJ-001" />
              </Form.Item>
              <Form.Item name="route_id" label="Route" rules={[{ required: true }]}>
                <Select>
                  {routes.map(route => (
                    <Option key={route.id} value={route.id}>{route.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="vehicle_id" label="Vehicle" rules={[{ required: true }]}>
                <Select>
                  {vehicles.map(vehicle => (
                    <Option key={vehicle.id} value={vehicle.id}>{vehicle.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="driver_id" label="Driver" rules={[{ required: true }]}>
                <Select>
                  {drivers.map(driver => (
                    <Option key={driver.id} value={driver.id}>{driver.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="cargo_description" label="Cargo Description" rules={[{ required: true }]}>
                <Input.TextArea rows={3} placeholder="Describe the cargo" />
              </Form.Item>
              <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="volume" label="Volume (m³)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="pickup_date" label="Pickup Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="delivery_date" label="Delivery Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="delivered">Delivered</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={3} placeholder="Additional notes" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Logistics;
