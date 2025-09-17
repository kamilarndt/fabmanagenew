import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Typography } from "antd";
import React, { useState } from "react";

const { Title } = Typography;

// Mock data
const mockMaterials = [
  {
    id: "1",
    code: "MAT001",
    name: "Steel Beam",
    category: "Structural",
    unit_price: 150.0,
    inventory_level: 25,
    supplier: "SteelCorp Ltd",
  },
  {
    id: "2",
    code: "MAT002",
    name: "Concrete Block",
    category: "Building",
    unit_price: 25.0,
    inventory_level: 100,
    supplier: "ConcreteWorks",
  },
  {
    id: "3",
    code: "MAT003",
    name: "Wood Plank",
    category: "Wood",
    unit_price: 45.0,
    inventory_level: 50,
    supplier: "TimberCo",
  },
];

const SimpleMaterials: React.FC = () => {
  const [materials] = useState(mockMaterials);

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "inventory_level",
      key: "inventory_level",
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Materials Management
          </Title>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Material
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={materials}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>
    </div>
  );
};

export default SimpleMaterials;
