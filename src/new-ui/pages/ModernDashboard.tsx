import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChartBarIcon,
  CogIcon,
  CubeIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { ModernBadge } from "../atoms/Badge/ModernBadge";
import { ModernButton } from "../atoms/Button/ModernButton";
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
} from "../atoms/Card/ModernCard";

const ModernDashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Projects",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: ChartBarIcon,
    },
    {
      title: "Active Tiles",
      value: "156",
      change: "+8%",
      changeType: "positive" as const,
      icon: CubeIcon,
    },
    {
      title: "Materials in Stock",
      value: "1,234",
      change: "-3%",
      changeType: "negative" as const,
      icon: CogIcon,
    },
    {
      title: "Budget Used",
      value: "78%",
      change: "+5%",
      changeType: "positive" as const,
      icon: ChartBarIcon,
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Modern Office Complex",
      client: "Acme Corp",
      status: "active",
      progress: 75,
      deadline: "2024-02-15",
    },
    {
      id: 2,
      name: "Residential Building A",
      client: "BuildCo Ltd",
      status: "planning",
      progress: 25,
      deadline: "2024-03-20",
    },
    {
      id: 3,
      name: "Shopping Center",
      client: "Retail Group",
      status: "completed",
      progress: 100,
      deadline: "2024-01-30",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <ModernBadge variant="success">Active</ModernBadge>;
      case "planning":
        return <ModernBadge variant="info">Planning</ModernBadge>;
      case "completed":
        return <ModernBadge variant="default">Completed</ModernBadge>;
      default:
        return <ModernBadge variant="outline">{status}</ModernBadge>;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
            <p className="text-lg text-secondary mt-2">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>
          <ModernButton size="lg" leftIcon={<PlusIcon className="h-5 w-5" />}>
            New Project
          </ModernButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ModernCard key={index} hover>
              <ModernCardContent padding="lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-primary mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === "positive" ? (
                        <ArrowUpIcon className="h-4 w-4 text-success-600 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-error-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "positive"
                            ? "text-success-600"
                            : "text-error-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-tertiary ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <stat.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <ModernCard>
              <ModernCardHeader
                title="Recent Projects"
                description="Your latest project updates and progress"
                action={
                  <ModernButton variant="ghost" size="sm">
                    View All
                  </ModernButton>
                }
              />
              <ModernCardContent padding="none">
                <div className="divide-y divide-border-light">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-6 hover:bg-tertiary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-primary">
                            {project.name}
                          </h3>
                          <p className="text-sm text-secondary mt-1">
                            {project.client}
                          </p>
                          <div className="flex items-center mt-3 space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-tertiary">Progress</span>
                                <span className="font-medium text-primary">
                                  {project.progress}%
                                </span>
                              </div>
                              <div className="mt-2 bg-tertiary rounded-full h-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-tertiary">Deadline</p>
                              <p className="text-sm font-medium text-primary">
                                {new Date(
                                  project.deadline
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-6">
                          {getStatusBadge(project.status)}
                          <ModernButton variant="ghost" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </ModernButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCardContent>
            </ModernCard>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <ModernCard>
              <ModernCardHeader title="Quick Actions" />
              <ModernCardContent>
                <div className="space-y-3">
                  <ModernButton
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Project
                  </ModernButton>
                  <ModernButton
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <CubeIcon className="h-4 w-4 mr-2" />
                    Create Tile
                  </ModernButton>
                  <ModernButton
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <CogIcon className="h-4 w-4 mr-2" />
                    Manage Materials
                  </ModernButton>
                </div>
              </ModernCardContent>
            </ModernCard>

            <ModernCard>
              <ModernCardHeader title="System Status" />
              <ModernCardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary">API Status</span>
                    <ModernBadge variant="success" dot>
                      Online
                    </ModernBadge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary">Database</span>
                    <ModernBadge variant="success" dot>
                      Connected
                    </ModernBadge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary">Storage</span>
                    <ModernBadge variant="warning" dot>
                      85% Used
                    </ModernBadge>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
