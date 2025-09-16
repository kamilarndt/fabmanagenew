import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Progress } from "@/new-ui/atoms/Progress/Progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { DetailPageLayout } from "@/new-ui/templates/DetailPageLayout/DetailPageLayout";
import * as React from "react";

interface ProjectDetailsPageProps {
  projectId: string;
}

export function ProjectDetailsPage({
  projectId,
}: ProjectDetailsPageProps): React.ReactElement {
  // Mock data - replace with actual data fetching
  const project = {
    id: projectId,
    name: "Modern Office Building",
    status: "in-progress",
    progress: 65,
    client: "Acme Corp",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    budget: 250000,
    spent: 162500,
  };

  const breadcrumbs = [
    { label: "Projects", href: "/projects" },
    { label: project.name },
  ];

  const actions = (
    <>
      <Button variant="outline">Edit Project</Button>
      <Button>Add Task</Button>
    </>
  );

  const sidebar = (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Project Stats</CardTitle>
        </CardHeader>
        <CardContent className="tw-space-y-4">
          <div>
            <div className="tw-flex tw-justify-between tw-text-sm tw-mb-2">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>

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
              <span className="tw-text-sm tw-text-muted-foreground">Spent</span>
              <span className="tw-text-sm">
                ${project.spent.toLocaleString()}
              </span>
            </div>
            <div className="tw-flex tw-justify-between">
              <span className="tw-text-sm tw-text-muted-foreground">
                Remaining
              </span>
              <span className="tw-text-sm">
                ${(project.budget - project.spent).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="tw-space-y-2">
          <Button variant="outline" className="tw-w-full tw-justify-start">
            View Timeline
          </Button>
          <Button variant="outline" className="tw-w-full tw-justify-start">
            Generate Report
          </Button>
          <Button variant="outline" className="tw-w-full tw-justify-start">
            Share Project
          </Button>
        </CardContent>
      </Card>
    </>
  );

  return (
    <DetailPageLayout
      title={project.name}
      description={`Project for ${project.client}`}
      breadcrumbs={breadcrumbs}
      actions={actions}
      sidebar={sidebar}
    >
      <Card>
        <CardHeader>
          <CardTitle className="tw-flex tw-items-center tw-gap-2">
            Project Overview
            <Badge
              variant={project.status === "in-progress" ? "default" : "outline"}
            >
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
                Status
              </label>
              <p className="tw-text-sm">
                <Badge
                  variant={
                    project.status === "in-progress" ? "default" : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="tw-space-y-4">
            <div className="tw-flex tw-items-start tw-space-x-3">
              <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-primary tw-mt-2"></div>
              <div>
                <p className="tw-text-sm">Task "Foundation Work" completed</p>
                <p className="tw-text-xs tw-text-muted-foreground">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="tw-flex tw-items-start tw-space-x-3">
              <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-success tw-mt-2"></div>
              <div>
                <p className="tw-text-sm">Material delivery received</p>
                <p className="tw-text-xs tw-text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="tw-flex tw-items-start tw-space-x-3">
              <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-warning tw-mt-2"></div>
              <div>
                <p className="tw-text-sm">Budget review scheduled</p>
                <p className="tw-text-xs tw-text-muted-foreground">
                  3 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DetailPageLayout>
  );
}
