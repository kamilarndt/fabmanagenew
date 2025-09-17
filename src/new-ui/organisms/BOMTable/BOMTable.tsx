// BOM Table Component - Shows Bill of Materials for a project
import React from "react";
import { Button } from "../../atoms/Button/Button";
import { Space } from "../../atoms/Space/Space";
import { Tag } from "../../atoms/Tag/Tag";
import { Typography } from "../../atoms/Typography/Typography";
import { Table } from "../../molecules/Table/Table";
// Tooltip component not available in new-ui yet, using Ant Design temporarily
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

const { Text } = Typography;

interface BOMItem {
  id: string;
  project_id: string;
  material_id: string | null;
  quantity: number;
  unit_cost: number | null;
  total_cost: number | null;
  created_at: string;
  updated_at: string;
  material?: {
    id: string;
    code: string;
    name: string;
    category: string | null;
    unit_price: number | null;
    supplier?: {
      id: string;
      name: string;
    };
  };
}

interface BOMTableProps {
  items: BOMItem[];
  isLoading: boolean;
  onEdit?: (item: BOMItem) => void;
  onDelete?: (item: BOMItem) => void;
}

export const BOMTable: React.FC<BOMTableProps> = ({
  items,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(quantity);
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

  const columns = [
    {
      title: "Material",
      key: "material",
      render: (record: BOMItem) => (
        <div>
          <div className="font-medium">
            {record.material?.name || "Unknown Material"}
          </div>
          <div className="text-sm text-gray-500">
            Code: {record.material?.code || "N/A"}
          </div>
          {record.material?.supplier && (
            <div className="text-xs text-gray-400">
              Supplier: {record.material.supplier.name}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: ["material", "category"],
      key: "category",
      render: (category: string | null) => (
        <Tag color={getCategoryColor(category)}>
          {category || "Uncategorized"}
        </Tag>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => (
        <Text strong>{formatQuantity(quantity)}</Text>
      ),
      sorter: (a: BOMItem, b: BOMItem) => a.quantity - b.quantity,
    },
    {
      title: "Unit Cost",
      dataIndex: "unit_cost",
      key: "unit_cost",
      render: (cost: number | null) => formatCurrency(cost),
      sorter: (a: BOMItem, b: BOMItem) =>
        (a.unit_cost || 0) - (b.unit_cost || 0),
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (cost: number | null) => (
        <Text strong className="text-green-600">
          {formatCurrency(cost)}
        </Text>
      ),
      sorter: (a: BOMItem, b: BOMItem) =>
        (a.total_cost || 0) - (b.total_cost || 0),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: BOMItem) => (
        <Space size="small">
          <Tooltip title="Edit item">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(record)}
            />
          </Tooltip>
          <Tooltip title="Delete item">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDelete?.(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalCost = items.reduce(
    (sum, item) => sum + (item.total_cost || 0),
    0
  );
  const totalItems = items.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-6">
          <div>
            <Text type="secondary">Total Items</Text>
            <div className="text-xl font-bold">{totalItems}</div>
          </div>
          <div>
            <Text type="secondary">Total Cost</Text>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(totalCost)}
            </div>
          </div>
        </div>
        <Tooltip title="BOM summary information">
          <InfoCircleOutlined className="text-gray-400" />
        </Tooltip>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={items}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 800 }}
        locale={{
          emptyText: "No BOM items yet. Add materials to get started!",
        }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <Text strong>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                {/* Unit Cost column - empty for total row */}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Text strong className="text-green-600">
                  {formatCurrency(totalCost)}
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                {/* Actions column - empty for total row */}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};
