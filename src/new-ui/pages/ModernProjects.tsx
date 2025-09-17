import {
  ArrowUpIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { ModernBadge } from "../atoms/Badge/ModernBadge";
import { ModernButton } from "../atoms/Button/ModernButton";
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
} from "../atoms/Card/ModernCard";

const ModernProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const projects = [
    {
      id: 1,
      name: "Modern Office Complex",
      client: "Acme Corp",
      status: "active",
      progress: 75,
      deadline: "2024-02-15",
      budget: 150000,
      spent: 112500,
      team: ["John Doe", "Jane Smith", "Mike Johnson"],
      description: "A modern office building with sustainable design features",
    },
    {
      id: 2,
      name: "Residential Building A",
      client: "BuildCo Ltd",
      status: "planning",
      progress: 25,
      deadline: "2024-03-20",
      budget: 200000,
      spent: 50000,
      team: ["Sarah Wilson", "Tom Brown"],
      description: "High-end residential complex with luxury amenities",
    },
    {
      id: 3,
      name: "Shopping Center",
      client: "Retail Group",
      status: "completed",
      progress: 100,
      deadline: "2024-01-30",
      budget: 300000,
      spent: 300000,
      team: ["Alex Davis", "Lisa Garcia", "Chris Lee"],
      description: "Large shopping center with multiple retail spaces",
    },
    {
      id: 4,
      name: "Tech Campus",
      client: "InnovateTech",
      status: "active",
      progress: 60,
      deadline: "2024-04-10",
      budget: 500000,
      spent: 300000,
      team: ["David Kim", "Emma Taylor", "Ryan Chen"],
      description: "State-of-the-art technology campus with R&D facilities",
    },
    {
      id: 5,
      name: "Green Energy Plant",
      client: "EcoPower",
      status: "on-hold",
      progress: 40,
      deadline: "2024-06-15",
      budget: 800000,
      spent: 320000,
      team: ["Maria Rodriguez", "James Wilson"],
      description: "Sustainable energy production facility",
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
      case "on-hold":
        return <ModernBadge variant="warning">On Hold</ModernBadge>;
      default:
        return <ModernBadge variant="outline">{status}</ModernBadge>;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalBudget = projects.reduce(
    (sum, project) => sum + project.budget,
    0
  );
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = projects.filter((p) => p.status === "active").length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">Projects</h1>
            <p className="text-lg text-secondary mt-2">
              Manage and track all your construction projects
            </p>
          </div>
          <ModernButton size="lg" leftIcon={<PlusIcon className="h-5 w-5" />}>
            New Project
          </ModernButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Total Projects
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {projects.length}
                  </p>
                </div>
                <div className="p-3 bg-primary-50 rounded-xl">
                  <ArrowUpIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Active Projects
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {activeProjects}
                  </p>
                </div>
                <div className="p-3 bg-success-50 rounded-xl">
                  <div className="h-6 w-6 bg-success-600 rounded-full"></div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Total Budget
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    ${totalBudget.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-warning-50 rounded-xl">
                  <div className="h-6 w-6 bg-warning-600 rounded-full"></div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Budget Used
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {Math.round((totalSpent / totalBudget) * 100)}%
                  </p>
                </div>
                <div className="p-3 bg-info-50 rounded-xl">
                  <div className="h-6 w-6 bg-info-600 rounded-full"></div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Filters */}
        <ModernCard>
          <ModernCardContent padding="lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                {["all", "active", "planning", "completed", "on-hold"].map(
                  (status) => (
                    <ModernButton
                      key={status}
                      variant={filterStatus === status ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </ModernButton>
                  )
                )}
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ModernCard key={project.id} hover>
              <ModernCardHeader
                title={project.name}
                description={project.client}
                action={getStatusBadge(project.status)}
              />
              <ModernCardContent>
                <p className="text-sm text-secondary mb-4">
                  {project.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-tertiary">Progress</span>
                    <span className="font-medium text-primary">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-tertiary">Budget</span>
                    <span className="font-medium text-primary">
                      ${project.spent.toLocaleString()} / $
                      {project.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-secondary">
                    {Math.round((project.spent / project.budget) * 100)}% used
                  </div>
                </div>

                {/* Team */}
                <div className="mb-4">
                  <p className="text-sm text-tertiary mb-2">Team</p>
                  <div className="flex flex-wrap gap-1">
                    {project.team.map((member, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-tertiary text-tertiary text-xs rounded-full"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="mb-6">
                  <p className="text-sm text-tertiary">Deadline</p>
                  <p className="text-sm font-medium text-primary">
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <ModernButton variant="outline" size="sm" className="flex-1">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View
                  </ModernButton>
                  <ModernButton variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </ModernButton>
                  <ModernButton variant="outline" size="sm">
                    <TrashIcon className="h-4 w-4" />
                  </ModernButton>
                </div>
              </ModernCardContent>
            </ModernCard>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <ModernCard>
            <ModernCardContent padding="lg" className="text-center">
              <div className="py-12">
                <div className="mx-auto h-12 w-12 bg-tertiary rounded-full flex items-center justify-center mb-4">
                  <PlusIcon className="h-6 w-6 text-tertiary" />
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  No projects found
                </h3>
                <p className="text-secondary mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first project"}
                </p>
                <ModernButton leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Create Project
                </ModernButton>
              </div>
            </ModernCardContent>
          </ModernCard>
        )}
      </div>
    </div>
  );
};

export default ModernProjects;
