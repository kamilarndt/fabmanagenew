import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Row, Space } from "antd";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  onViewProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onAddProject?: () => void;
  onStatusChange?: (project: Project, status: string) => void;
}

export function ProjectList({
  projects,
  loading = false,
  onViewProject,
  onEditProject,
  onAddProject,
}: ProjectListProps) {
  if (projects.length === 0 && !loading) {
    return (
      <div>
        <PageHeader
          title="Projects"
          subtitle="Manage your projects and track progress"
          actions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddProject}
            >
              Add Project
            </Button>
          }
        />
        <Empty
          description="No projects found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddProject}>
            Create your first project
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${
          projects.length !== 1 ? "s" : ""
        } total`}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAddProject}>
              Add Project
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {projects.map((project) => (
          <Col key={project.id} xs={24} sm={12} lg={8} xl={6}>
            <ProjectCard
              project={project}
              onView={onViewProject}
              onEdit={onEditProject}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
