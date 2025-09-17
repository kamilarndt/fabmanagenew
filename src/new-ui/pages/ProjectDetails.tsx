// Project Details Page - Main project view with modules
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePresence, useProjectRealtime } from "../../hooks/useRealtime";
import { useMaterialStore } from "../../stores/materialStore";
import { useProjectStore } from "../../stores/projectStore";
import { Button } from "../atoms/Button/Button";
import { Space } from "../atoms/Space/Space";
import { Spin } from "../atoms/Spin/Spin";
import { Tabs } from "../atoms/Tabs/Tabs";
import { Card } from "../molecules/Card/Card";
import { AddBOMItemDrawer } from "../organisms/AddBOMItemDrawer/AddBOMItemDrawer";
import { BOMTable } from "../organisms/BOMTable/BOMTable";
import { ProjectHeader } from "../organisms/ProjectHeader/ProjectHeader";
import { ProjectMessages } from "../organisms/ProjectMessages/ProjectMessages";
import { ProjectTimeline } from "../organisms/ProjectTimeline/ProjectTimeline";

const { TabPane } = Tabs;

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentProject,
    messages,
    activity,
    isLoading,
    error,
    fetchProject,
    fetchMessages,
    fetchActivity,
    setCurrentProject,
  } = useProjectStore();

  const { bomItems, fetchBOMItems } = useMaterialStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [isBOMDrawerOpen, setIsBOMDrawerOpen] = useState(false);

  // Real-time subscriptions
  const projectRealtime = useProjectRealtime(id || null);
  const { onlineUsers } = usePresence(id || null);

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchMessages(id);
      fetchActivity(id);
      fetchBOMItems(id);
    }
  }, [id, fetchProject, fetchMessages, fetchActivity, fetchBOMItems]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleBack = () => {
    navigate("/projects");
    setCurrentProject(null);
  };

  const handleEditProject = () => {
    // TODO: Open edit project drawer
    message.info("Edit project functionality coming soon");
  };

  const handleAddBOMItem = () => {
    setIsBOMDrawerOpen(true);
  };

  const handleBOMItemAdded = () => {
    if (id) {
      fetchBOMItems(id);
    }
    setIsBOMDrawerOpen(false);
    message.success("BOM item added successfully");
  };

  if (isLoading && !currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <h2>Project not found</h2>
            <p className="text-gray-500 mb-4">
              The project you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button type="primary" onClick={handleBack}>
              Back to Projects
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const projectBOMItems = bomItems[currentProject.id] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentProject.name}
              </h1>
              <p className="text-gray-600">
                {currentProject.client?.name} • {currentProject.status}
                {onlineUsers.length > 0 && (
                  <span className="ml-2 text-green-600">
                    • {onlineUsers.length} online
                  </span>
                )}
              </p>
            </div>
          </div>
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEditProject}>
              Edit Project
            </Button>
          </Space>
        </div>
      </div>

      {/* Project Header */}
      <div className="p-6">
        <ProjectHeader project={currentProject} />
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: "overview",
              label: "Overview",
              children: (
                <div className="space-y-6">
                  {/* Messages */}
                  <Card
                    title="Messages"
                    extra={
                      <Button type="primary" size="small">
                        Add Message
                      </Button>
                    }
                  >
                    <ProjectMessages
                      messages={messages}
                      isLoading={isLoading}
                    />
                  </Card>

                  {/* Activity Timeline */}
                  <Card title="Activity Timeline">
                    <ProjectTimeline
                      activity={activity}
                      isLoading={isLoading}
                    />
                  </Card>
                </div>
              ),
            },
            {
              key: "materials",
              label: "Materials & BOM",
              children: (
                <Card
                  title="Bill of Materials"
                  extra={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddBOMItem}
                    >
                      Add Material
                    </Button>
                  }
                >
                  <BOMTable items={projectBOMItems} isLoading={isLoading} />
                </Card>
              ),
            },
            {
              key: "tiles",
              label: "Elements",
              children: (
                <Card title="Project Elements">
                  <div className="text-center py-8 text-gray-500">
                    Kanban board for project elements coming soon...
                  </div>
                </Card>
              ),
            },
            {
              key: "pricing",
              label: "Pricing",
              children: (
                <Card title="Project Pricing">
                  <div className="text-center py-8 text-gray-500">
                    Pricing calculations coming soon...
                  </div>
                </Card>
              ),
            },
            {
              key: "files",
              label: "Files",
              children: (
                <Card title="Project Files">
                  <div className="text-center py-8 text-gray-500">
                    File management coming soon...
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </div>

      {/* BOM Item Drawer */}
      <AddBOMItemDrawer
        open={isBOMDrawerOpen}
        onClose={() => setIsBOMDrawerOpen(false)}
        onSuccess={handleBOMItemAdded}
        projectId={currentProject.id}
      />
    </div>
  );
};
