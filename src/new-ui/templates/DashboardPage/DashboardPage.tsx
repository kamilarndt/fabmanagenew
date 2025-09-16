import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { Progress } from "@/new-ui/atoms/Progress/Progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTiles: number;
  completedTiles: number;
  totalMaterials: number;
  lowStockMaterials: number;
  totalBudget: number;
  spentBudget: number;
}

export interface RecentActivity {
  id: string;
  type: "project" | "tile" | "material";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export interface DashboardPageProps {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  onViewAll?: (type: string) => void;
  className?: string;
}

export function DashboardPage({
  stats,
  recentActivities,
  onViewAll,
  className,
}: DashboardPageProps): React.ReactElement {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project":
        return "folder";
      case "tile":
        return "square";
      case "material":
        return "package";
      default:
        return "activity";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "project":
        return "text-blue-600";
      case "tile":
        return "text-green-600";
      case "material":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={cn("tw-space-y-6", className)}>
      {/* Stats Grid */}
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
        {/* Projects */}
        <Card>
          <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-y-0 tw-pb-2">
            <CardTitle className="tw-text-sm tw-font-medium">
              Total Projects
            </CardTitle>
            <Icon
              name="folder"
              className="tw-h-4 tw-w-4 tw-text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="tw-text-2xl tw-font-bold">
              {stats.totalProjects}
            </div>
            <p className="tw-text-xs tw-text-muted-foreground">
              {stats.activeProjects} active, {stats.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        {/* Tiles */}
        <Card>
          <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-y-0 tw-pb-2">
            <CardTitle className="tw-text-sm tw-font-medium">
              Total Tiles
            </CardTitle>
            <Icon
              name="square"
              className="tw-h-4 tw-w-4 tw-text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="tw-text-2xl tw-font-bold">{stats.totalTiles}</div>
            <p className="tw-text-xs tw-text-muted-foreground">
              {stats.completedTiles} completed
            </p>
          </CardContent>
        </Card>

        {/* Materials */}
        <Card>
          <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-y-0 tw-pb-2">
            <CardTitle className="tw-text-sm tw-font-medium">
              Materials
            </CardTitle>
            <Icon
              name="package"
              className="tw-h-4 tw-w-4 tw-text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="tw-text-2xl tw-font-bold">
              {stats.totalMaterials}
            </div>
            <p className="tw-text-xs tw-text-muted-foreground">
              {stats.lowStockMaterials} low stock
            </p>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-y-0 tw-pb-2">
            <CardTitle className="tw-text-sm tw-font-medium">Budget</CardTitle>
            <Icon
              name="dollar-sign"
              className="tw-h-4 tw-w-4 tw-text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="tw-text-2xl tw-font-bold">
              ${stats.spentBudget.toLocaleString()}
            </div>
            <p className="tw-text-xs tw-text-muted-foreground">
              of ${stats.totalBudget.toLocaleString()} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="tw-space-y-4">
            <div className="tw-space-y-2">
              <div className="tw-flex tw-justify-between tw-text-sm">
                <span>Active Projects</span>
                <span>{stats.activeProjects}</span>
              </div>
              <Progress
                value={(stats.activeProjects / stats.totalProjects) * 100}
              />
            </div>
            <div className="tw-space-y-2">
              <div className="tw-flex tw-justify-between tw-text-sm">
                <span>Completed Projects</span>
                <span>{stats.completedProjects}</span>
              </div>
              <Progress
                value={(stats.completedProjects / stats.totalProjects) * 100}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Usage</CardTitle>
          </CardHeader>
          <CardContent className="tw-space-y-4">
            <div className="tw-space-y-2">
              <div className="tw-flex tw-justify-between tw-text-sm">
                <span>Spent</span>
                <span>${stats.spentBudget.toLocaleString()}</span>
              </div>
              <Progress value={(stats.spentBudget / stats.totalBudget) * 100} />
            </div>
            <div className="tw-flex tw-justify-between tw-text-sm">
              <span>Remaining</span>
              <span>
                ${(stats.totalBudget - stats.spentBudget).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewAll?.("activity")}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="tw-space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="tw-flex tw-items-start tw-gap-3"
              >
                <div className={cn("tw-mt-1", getActivityColor(activity.type))}>
                  <Icon
                    name={getActivityIcon(activity.type)}
                    className="tw-h-4 tw-w-4"
                  />
                </div>
                <div className="tw-flex-1 tw-space-y-1">
                  <p className="tw-text-sm tw-font-medium">{activity.title}</p>
                  <p className="tw-text-sm tw-text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <p className="tw-text-xs tw-text-muted-foreground">
                      {activity.timestamp}
                    </p>
                    {activity.status && (
                      <Badge variant="outline" className="tw-text-xs">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
