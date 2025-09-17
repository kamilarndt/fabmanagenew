// Project Header Component - Shows project overview information
import {
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { Progress } from "../../atoms/Progress/Progress";
import { Statistic } from "../../atoms/Statistic/Statistic";
import { Tag } from "../../atoms/Tag/Tag";
import { Card } from "../../molecules/Card/Card";
import { Descriptions } from "../../molecules/Descriptions/Descriptions";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    client_id: string | null;
    status: string;
    budget: number | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    client?: {
      id: string;
      name: string;
      company_name: string | null;
    };
  };
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "on_hold":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "on_hold":
        return "On Hold";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Not set";
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  // Calculate project progress (mock data for now)
  const progress = 65; // TODO: Calculate based on actual project data

  return (
    <div className="space-y-6">
      {/* Project Overview Card */}
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Descriptions
              title="Project Information"
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
            >
              <Descriptions.Item label="Project Name">
                <span className="font-semibold">{project.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                <div>
                  <div className="font-medium">{project.client?.name}</div>
                  {project.client?.company_name && (
                    <div className="text-sm text-gray-500">
                      {project.client.company_name}
                    </div>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Budget">
                {formatCurrency(project.budget)}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                <CalendarOutlined className="mr-1" />
                {formatDate(project.start_date)}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                <CalendarOutlined className="mr-1" />
                {formatDate(project.end_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(project.created_at)}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col xs={24} lg={8}>
            <div className="space-y-4">
              {/* Progress */}
              <Card size="small" title="Project Progress">
                <Progress
                  percent={progress}
                  status={progress === 100 ? "success" : "active"}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
                <div className="text-sm text-gray-500 mt-2">
                  {progress}% completed
                </div>
              </Card>

              {/* Quick Stats */}
              <Card size="small" title="Quick Stats">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Budget"
                      value={project.budget || 0}
                      prefix={<DollarOutlined />}
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Client"
                      value={project.client?.name || "Unknown"}
                      prefix={<UserOutlined />}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
