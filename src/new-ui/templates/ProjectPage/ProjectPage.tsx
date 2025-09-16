import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Progress } from "@/new-ui/atoms/Progress/Progress";
import { Separator } from "@/new-ui/atoms/Separator/Separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { PageHeader } from "@/new-ui/organisms/PageHeader/PageHeader";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  progress: number;
  client: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: "pending" | "in-progress" | "completed";
    assignee: string;
    dueDate: string;
  }>;
}

export interface ProjectPageProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  onTaskClick?: (taskId: string) => void;
  onTeamMemberClick?: (memberId: string) => void;
  className?: string;
}

export function ProjectPage({
  project,
  onEdit,
  onDelete,
  onTaskClick,
  onTeamMemberClick,
  className,
}: ProjectPageProps): React.ReactElement {
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "default";
      case "planning":
        return "warning";
      case "on-hold":
        return "destructive";
      default:
        return "default";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "default";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const breadcrumbs = [
    { label: "Projects", href: "/projects" },
    { label: project.name },
  ];

  const actions = (
    <div className="tw-flex tw-gap-2">
      <Button variant="outline" onClick={onEdit}>
        Edit Project
      </Button>
      <Button variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className={cn("tw-space-y-6", className)}>
      <PageHeader
        title={project.name}
        description={project.description}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6">
        {/* Main Content */}
        <div className="lg:tw-col-span-2 tw-space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="tw-flex tw-items-center tw-gap-2">
                Project Overview
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                <div>
                  <label className="tw-text-sm tw-font-medium tw-text-muted-foreground">
                    Client
                  </label>
                  <p className="tw-text-sm">{project.client}</p>
                </div>
                <div>
                  <label className="tw-text-sm tw-font-medium tw-text-muted-foreground">
                    Start Date
                  </label>
                  <p className="tw-text-sm">{project.startDate}</p>
                </div>
                <div>
                  <label className="tw-text-sm tw-font-medium tw-text-muted-foreground">
                    End Date
                  </label>
                  <p className="tw-text-sm">{project.endDate}</p>
                </div>
                <div>
                  <label className="tw-text-sm tw-font-medium tw-text-muted-foreground">
                    Progress
                  </label>
                  <div className="tw-space-y-1">
                    <Progress value={project.progress} />
                    <p className="tw-text-xs tw-text-muted-foreground">
                      {project.progress}% complete
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="tw-space-y-3">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="tw-flex tw-items-center tw-justify-between tw-rounded-lg tw-border tw-p-3 hover:tw-bg-muted/50 tw-cursor-pointer"
                    onClick={() => onTaskClick?.(task.id)}
                  >
                    <div className="tw-flex tw-items-center tw-gap-3">
                      <Badge variant={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <div>
                        <p className="tw-text-sm tw-font-medium">
                          {task.title}
                        </p>
                        <p className="tw-text-xs tw-text-muted-foreground">
                          Assigned to {task.assignee}
                        </p>
                      </div>
                    </div>
                    <p className="tw-text-xs tw-text-muted-foreground">
                      Due: {task.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="tw-space-y-6">
          {/* Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-4">
              <div className="tw-space-y-2">
                <div className="tw-flex tw-justify-between">
                  <span className="tw-text-sm tw-text-muted-foreground">
                    Budget
                  </span>
                  <span className="tw-text-sm">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
                <div className="tw-flex tw-justify-between">
                  <span className="tw-text-sm tw-text-muted-foreground">
                    Spent
                  </span>
                  <span className="tw-text-sm">
                    ${project.spent.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="tw-flex tw-justify-between">
                  <span className="tw-text-sm tw-font-medium">Remaining</span>
                  <span className="tw-text-sm tw-font-medium">
                    ${(project.budget - project.spent).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="tw-space-y-3">
                {project.team.map((member) => (
                  <div
                    key={member.id}
                    className="tw-flex tw-items-center tw-gap-3 tw-cursor-pointer hover:tw-bg-muted/50 tw-rounded-lg tw-p-2"
                    onClick={() => onTeamMemberClick?.(member.id)}
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="tw-h-8 tw-w-8 tw-rounded-full"
                      />
                    ) : (
                      <div className="tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary tw-text-primary-foreground tw-text-xs tw-font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="tw-text-sm tw-font-medium">{member.name}</p>
                      <p className="tw-text-xs tw-text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
