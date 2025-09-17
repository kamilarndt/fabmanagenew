import {
  CalculatorOutlined,
  DollarOutlined,
  DownloadOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { usePricingStore } from "../stores/pricingStore";
import { PricingCalculation } from "../types/pricing.types";

const { Search } = Input;
const { Option } = Select;

const Pricing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");

  const {
    calculations,
    isLoading,
    error,
    fetchCalculations,
    calculateProjectPricing,
    exportPricing,
  } = usePricingStore();

  useEffect(() => {
    fetchCalculations();
  }, [fetchCalculations]);

  const filteredCalculations = calculations.filter(
    (calc) =>
      calc.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCalculatePricing = async (projectId: string) => {
    try {
      await calculateProjectPricing(projectId);
      message.success("Pricing calculated successfully");
    } catch (error) {
      message.error("Failed to calculate pricing");
    }
  };

  const handleExportPricing = async (calculationId: string) => {
    try {
      await exportPricing(calculationId);
      message.success("Pricing exported successfully");
    } catch (error) {
      message.error("Failed to export pricing");
    }
  };

  const getTotalCost = (calc: PricingCalculation) => {
    return (
      calc.materials_cost +
      calc.labor_cost +
      calc.equipment_cost +
      calc.transport_cost +
      calc.accommodation_cost
    );
  };

  const getProfitMargin = (calc: PricingCalculation) => {
    const totalCost = getTotalCost(calc);
    return totalCost > 0
      ? ((calc.selling_price - totalCost) / calc.selling_price) * 100
      : 0;
  };

  const columns = [
    {
      title: "Project",
      dataIndex: "project_name",
      key: "project_name",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "Materials",
      dataIndex: "materials_cost",
      key: "materials_cost",
      width: 100,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: "Labor",
      dataIndex: "labor_cost",
      key: "labor_cost",
      width: 100,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: "Equipment",
      dataIndex: "equipment_cost",
      key: "equipment_cost",
      width: 100,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: "Transport",
      dataIndex: "transport_cost",
      key: "transport_cost",
      width: 100,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: "Accommodation",
      dataIndex: "accommodation_cost",
      key: "accommodation_cost",
      width: 120,
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: "Total Cost",
      key: "total_cost",
      width: 100,
      render: (_: any, record: PricingCalculation) =>
        `$${getTotalCost(record).toFixed(2)}`,
    },
    {
      title: "Selling Price",
      dataIndex: "selling_price",
      key: "selling_price",
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Profit Margin",
      key: "profit_margin",
      width: 120,
      render: (_: any, record: PricingCalculation) => {
        const margin = getProfitMargin(record);
        const color = margin > 20 ? "green" : margin > 10 ? "orange" : "red";
        return <Tag color={color}>{margin.toFixed(1)}%</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const color =
          status === "approved"
            ? "green"
            : status === "pending"
            ? "orange"
            : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: PricingCalculation) => (
        <Space>
          <Button
            type="text"
            icon={<CalculatorOutlined />}
            onClick={() => handleCalculatePricing(record.project_id)}
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleExportPricing(record.id)}
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
          <p className="mt-2 text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading pricing data: {error}</p>
          <Button onClick={() => fetchCalculations()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalProjects = calculations.length;
  const approvedProjects = calculations.filter(
    (calc) => calc.status === "approved"
  ).length;
  const totalRevenue = calculations.reduce(
    (sum, calc) => sum + calc.selling_price,
    0
  );
  const totalCosts = calculations.reduce(
    (sum, calc) => sum + getTotalCost(calc),
    0
  );
  const averageProfitMargin =
    calculations.length > 0
      ? calculations.reduce((sum, calc) => sum + getProfitMargin(calc), 0) /
        calculations.length
      : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Pricing Management</h1>

        <div className="flex space-x-4 mb-4">
          <Search
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            value={selectedProject}
            onChange={setSelectedProject}
            style={{ width: 200 }}
          >
            <Option value="all">All Projects</Option>
            <Option value="approved">Approved</Option>
            <Option value="pending">Pending</Option>
            <Option value="draft">Draft</Option>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Projects"
              value={totalProjects}
              prefix={<CalculatorOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Approved Projects"
              value={approvedProjects}
              suffix={`/ ${totalProjects}`}
              valueStyle={{ color: "#3f8600" }}
            />
            <Progress
              percent={
                totalProjects > 0 ? (approvedProjects / totalProjects) * 100 : 0
              }
              size="small"
              className="mt-2"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Profit Margin"
              value={averageProfitMargin}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{
                color:
                  averageProfitMargin > 20
                    ? "#3f8600"
                    : averageProfitMargin > 10
                    ? "#faad14"
                    : "#cf1322",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Cost Breakdown */}
      <Row gutter={16} className="mb-6">
        <Col span={12}>
          <Card title="Cost Breakdown" size="small">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Materials:</span>
                <span>
                  $
                  {calculations
                    .reduce((sum, calc) => sum + calc.materials_cost, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Labor:</span>
                <span>
                  $
                  {calculations
                    .reduce((sum, calc) => sum + calc.labor_cost, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Equipment:</span>
                <span>
                  $
                  {calculations
                    .reduce((sum, calc) => sum + calc.equipment_cost, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transport:</span>
                <span>
                  $
                  {calculations
                    .reduce((sum, calc) => sum + calc.transport_cost, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Accommodation:</span>
                <span>
                  $
                  {calculations
                    .reduce((sum, calc) => sum + calc.accommodation_cost, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Costs:</span>
                <span>${totalCosts.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Profit Analysis" size="small">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span>${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Costs:</span>
                <span>${totalCosts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Net Profit:</span>
                <span
                  className={
                    totalRevenue - totalCosts > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  ${(totalRevenue - totalCosts).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Profit Margin:</span>
                <span
                  className={
                    totalRevenue > 0
                      ? ((totalRevenue - totalCosts) / totalRevenue) * 100 > 20
                        ? "text-green-600"
                        : "text-orange-600"
                      : "text-red-600"
                  }
                >
                  {totalRevenue > 0
                    ? (
                        ((totalRevenue - totalCosts) / totalRevenue) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Pricing Table */}
      <Card title="Project Pricing">
        <Table
          columns={columns}
          dataSource={filteredCalculations}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Pricing;
