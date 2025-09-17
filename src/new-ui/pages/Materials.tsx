// Materials Management Page - Complete materials and suppliers management
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button } from "../atoms/Button/Button";
import { Input } from "../atoms/Input/Input";
import { Card } from "../molecules/Card/Card";
// Modal component not available in new-ui yet, using Ant Design temporarily
import { Modal } from "antd";
import { Space } from "../atoms/Space/Space";
import { Tabs } from "../atoms/Tabs/Tabs";
import { Tag } from "../atoms/Tag/Tag";
import { Select } from "../molecules/Select/Select";
import { Table } from "../molecules/Table/Table";
// Tooltip component not available in new-ui yet, using Ant Design temporarily
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useMaterialStore } from "../../stores/materialStore";
import { Typography } from "../atoms/Typography/Typography";
import { AddMaterialDrawer } from "../organisms/AddMaterialDrawer/AddMaterialDrawer";
import { AddSupplierDrawer } from "../organisms/AddSupplierDrawer/AddSupplierDrawer";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

export const Materials: React.FC = () => {
  const [activeTab, setActiveTab] = useState("materials");
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const {
    materials,
    suppliers,
    isLoading,
    error,
    fetchMaterials,
    fetchSuppliers,
    deleteMaterial,
    deleteSupplier,
    clearError,
  } = useMaterialStore();

  useEffect(() => {
    fetchMaterials();
    fetchSuppliers();
  }, [fetchMaterials, fetchSuppliers]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleDeleteMaterial = (material: any) => {
    Modal.confirm({
      title: "Delete Material",
      content: `Are you sure you want to delete "${material.name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteMaterial(material.id);
          message.success("Material deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete material");
        }
      },
    });
  };

  const handleDeleteSupplier = (supplier: any) => {
    Modal.confirm({
      title: "Delete Supplier",
      content: `Are you sure you want to delete "${supplier.name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteSupplier(supplier.id);
          message.success("Supplier deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete supplier");
        }
      },
    });
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return "default";

    const colors: Record<string, string> = {
      "Materiały konstrukcyjne": "blue",
      "Materiały malarskie": "green",
      Tekstylia: "purple",
      Oświetlenie: "orange",
      Łączniki: "cyan",
      Kleje: "magenta",
      Elektryka: "red",
    };

    return colors[category] || "default";
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchText.toLowerCase()) ||
      material.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      !selectedCategory || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const materialColumns = [
    {
      title: "Material",
      key: "material",
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-sm text-gray-500">Code: {record.code}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string | null) => (
        <Tag color={getCategoryColor(category)}>
          {category || "Uncategorized"}
        </Tag>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price: number | null) => formatCurrency(price),
      sorter: (a: any, b: any) => (a.unit_price || 0) - (b.unit_price || 0),
    },
    {
      title: "Inventory",
      dataIndex: "inventory_level",
      key: "inventory_level",
      render: (level: number) => (
        <Text
          className={
            level > 10
              ? "text-green-600"
              : level > 0
                ? "text-orange-600"
                : "text-red-600"
          }
        >
          {level} units
        </Text>
      ),
      sorter: (a: any, b: any) => a.inventory_level - b.inventory_level,
    },
    {
      title: "Supplier",
      key: "supplier",
      render: (record: any) => (
        <div>
          {record.supplier ? (
            <div>
              <div className="font-medium">{record.supplier.name}</div>
            </div>
          ) : (
            <Text type="secondary">No supplier</Text>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Edit material">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingMaterial(record);
                setIsAddMaterialOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete material">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteMaterial(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const supplierColumns = [
    {
      title: "Supplier",
      key: "supplier",
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-sm text-gray-500">
            {record.contact_info?.email || "No email"}
          </div>
        </div>
      ),
    },
    {
      title: "Contact Info",
      key: "contact_info",
      render: (record: any) => (
        <div>
          {record.contact_info?.phone && (
            <div className="text-sm">📞 {record.contact_info.phone}</div>
          )}
          {record.contact_info?.address && (
            <div className="text-sm">📍 {record.contact_info.address}</div>
          )}
        </div>
      ),
    },
    {
      title: "Materials Count",
      key: "materials_count",
      render: (record: any) => {
        const count = materials.filter(
          (m) => m.supplier_id === record.id
        ).length;
        return <Tag color="blue">{count} materials</Tag>;
      },
      sorter: (a: any, b: any) => {
        const countA = materials.filter((m) => m.supplier_id === a.id).length;
        const countB = materials.filter((m) => m.supplier_id === b.id).length;
        return countA - countB;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Edit supplier">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingSupplier(record);
                setIsAddSupplierOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete supplier">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteSupplier(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const categories = Array.from(
    new Set(materials.map((m) => m.category).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="mb-2">
                Materials Management
              </Title>
              <Text type="secondary">
                Manage materials, suppliers, and inventory levels
              </Text>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddSupplierOpen(true)}
              >
                Add Supplier
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddMaterialOpen(true)}
              >
                Add Material
              </Button>
            </Space>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Materials" key="materials">
              {/* Filters */}
              <div className="mb-4 flex items-center space-x-4">
                <Search
                  placeholder="Search materials..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                  prefix={<SearchOutlined />}
                />
                <Select
                  placeholder="Filter by category"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  allowClear
                  style={{ width: 200 }}
                >
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <InfoCircleOutlined />
                  <span>{filteredMaterials.length} materials found</span>
                </div>
              </div>

              {/* Materials Table */}
              <Table
                columns={materialColumns}
                dataSource={filteredMaterials}
                loading={isLoading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} materials`,
                }}
                scroll={{ x: 800 }}
                locale={{
                  emptyText:
                    "No materials found. Add your first material to get started!",
                }}
              />
            </TabPane>

            <TabPane tab="Suppliers" key="suppliers">
              {/* Suppliers Table */}
              <Table
                columns={supplierColumns}
                dataSource={suppliers}
                loading={isLoading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} suppliers`,
                }}
                scroll={{ x: 600 }}
                locale={{
                  emptyText:
                    "No suppliers found. Add your first supplier to get started!",
                }}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* Add Material Drawer */}
        <AddMaterialDrawer
          open={isAddMaterialOpen}
          onClose={() => {
            setIsAddMaterialOpen(false);
            setEditingMaterial(null);
          }}
          onSuccess={() => {
            setIsAddMaterialOpen(false);
            setEditingMaterial(null);
            fetchMaterials();
            message.success(
              editingMaterial
                ? "Material updated successfully"
                : "Material added successfully"
            );
          }}
          material={editingMaterial}
        />

        {/* Add Supplier Drawer */}
        <AddSupplierDrawer
          open={isAddSupplierOpen}
          onClose={() => {
            setIsAddSupplierOpen(false);
            setEditingSupplier(null);
          }}
          onSuccess={() => {
            setIsAddSupplierOpen(false);
            setEditingSupplier(null);
            fetchSuppliers();
            message.success(
              editingSupplier
                ? "Supplier updated successfully"
                : "Supplier added successfully"
            );
          }}
          supplier={editingSupplier}
        />
      </div>
    </div>
  );
};
