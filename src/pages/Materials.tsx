import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useMaterialStore } from "../stores/materialStore";
import { Material } from "../types/materials.types";

const { Search } = Input;

const Materials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [form] = Form.useForm();

  const {
    materials,
    suppliers,
    isLoading,
    error,
    fetchMaterials,
    fetchSuppliers,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  } = useMaterialStore();

  useEffect(() => {
    fetchMaterials();
    fetchSuppliers();
  }, [fetchMaterials, fetchSuppliers]);

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    form.setFieldsValue(material);
    setIsModalOpen(true);
  };

  const handleDeleteMaterial = async (material: Material) => {
    try {
      await deleteMaterial(material.id);
      message.success("Material deleted successfully");
    } catch (error) {
      message.error("Failed to delete material");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, values);
        message.success("Material updated successfully");
      } else {
        await createMaterial(values);
        message.success("Material added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save material");
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 80,
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      width: 100,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: 100,
      render: (quantity: number, record: Material) => {
        const isLowStock = quantity <= record.min_stock_level;
        const isOverstock = quantity >= record.max_stock_level;

        return (
          <span
            className={
              isLowStock ? "text-red-600" : isOverstock ? "text-orange-600" : ""
            }
          >
            {quantity}
          </span>
        );
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      width: 150,
      render: (supplier: any) => supplier?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: Material) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => message.info("View details coming soon")}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditMaterial(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteMaterial(record)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading materials: {error}</p>
          <Button onClick={() => fetchMaterials()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Materials Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddMaterial}
        >
          Add Material
        </Button>
      </div>

      <div className="mb-4">
        <Search
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredMaterials}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingMaterial ? "Edit Material" : "Add Material"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Material Code"
            rules={[{ required: true, message: "Please enter material code" }]}
          >
            <Input placeholder="e.g., MAT-001" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Material Name"
            rules={[{ required: true, message: "Please enter material name" }]}
          >
            <Input placeholder="e.g., Steel Beam" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Material description" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="steel">Steel</Select.Option>
              <Select.Option value="wood">Wood</Select.Option>
              <Select.Option value="concrete">Concrete</Select.Option>
              <Select.Option value="fabric">Fabric</Select.Option>
              <Select.Option value="hardware">Hardware</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: "Please enter unit" }]}
          >
            <Input placeholder="e.g., pcs, kg, m" />
          </Form.Item>

          <Form.Item
            name="unit_price"
            label="Unit Price"
            rules={[{ required: true, message: "Please enter unit price" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item name="supplier_id" label="Supplier">
            <Select placeholder="Select supplier" allowClear>
              {suppliers.map((supplier) => (
                <Select.Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="stock_quantity"
            label="Stock Quantity"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item
            name="min_stock_level"
            label="Minimum Stock Level"
            rules={[
              { required: true, message: "Please enter minimum stock level" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item
            name="max_stock_level"
            label="Maximum Stock Level"
            rules={[
              { required: true, message: "Please enter maximum stock level" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="e.g., Warehouse A, Shelf 1" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Materials;
