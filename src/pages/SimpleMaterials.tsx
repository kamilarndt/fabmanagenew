import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../new-ui/atoms/Button/Button";
import { Card } from "../new-ui/molecules/Card/Card";
import { Space } from "../new-ui/atoms/Space/Space";
import { Table } from "../new-ui/molecules/Table/Table";
import { Typography } from "../new-ui/atoms/Typography/Typography";

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
  {
    id: "4",
    code: "MAT004",
    name: "Aluminum Sheet",
    category: "Metal",
    unit_price: 80.0,
    inventory_level: 15,
    supplier: "MetalWorks",
  },
  {
    id: "5",
    code: "MAT005",
    name: "Glass Panel",
    category: "Glass",
    unit_price: 120.0,
    inventory_level: 8,
    supplier: "GlassCorp",
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
      title: "Inventory",
      dataIndex: "inventory_level",
      key: "inventory_level",
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={2} className="mb-0">
          Materials Management
        </Typography.Title>
        <Button variant="primary" icon={<Plus />}>
          Add Material
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={materials}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default SimpleMaterials;