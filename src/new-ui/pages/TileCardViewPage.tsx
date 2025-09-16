import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Progress } from "@/new-ui/atoms/Progress/Progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { CardGridLayout } from "@/new-ui/templates/CardGridLayout/CardGridLayout";
import * as React from "react";

interface Tile {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "on-hold";
  progress: number;
  material: string;
  dimensions: string;
  priority: "low" | "medium" | "high";
  assignedTo: string;
  dueDate: string;
}

export function TileCardViewPage(): React.ReactElement {
  // Mock data - replace with actual data fetching
  const tiles: Tile[] = [
    {
      id: "1",
      name: "Kitchen Countertop",
      status: "in-progress",
      progress: 75,
      material: "Granite",
      dimensions: "120x60x3 cm",
      priority: "high",
      assignedTo: "John Doe",
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      name: "Bathroom Vanity",
      status: "pending",
      progress: 0,
      material: "Marble",
      dimensions: "80x40x2 cm",
      priority: "medium",
      assignedTo: "Jane Smith",
      dueDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Office Desk",
      status: "completed",
      progress: 100,
      material: "Wood",
      dimensions: "150x75x4 cm",
      priority: "low",
      assignedTo: "Mike Johnson",
      dueDate: "2024-02-10",
    },
    {
      id: "4",
      name: "Window Sill",
      status: "on-hold",
      progress: 30,
      material: "Quartz",
      dimensions: "200x20x2 cm",
      priority: "medium",
      assignedTo: "Sarah Wilson",
      dueDate: "2024-02-25",
    },
  ];

  const breadcrumbs = [
    { label: "Projects", href: "/projects" },
    { label: "Modern Office Building", href: "/projects/1" },
    { label: "Tiles" },
  ];

  const actions = (
    <>
      <Button variant="outline">Filter</Button>
      <Button>Add Tile</Button>
    </>
  );

  const getStatusColor = (status: Tile["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "default";
      case "pending":
        return "warning";
      case "on-hold":
        return "destructive";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: Tile["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <CardGridLayout
      title="Project Tiles"
      description="Manage and track tile production progress"
      breadcrumbs={breadcrumbs}
      actions={actions}
      gridCols={3}
    >
      {tiles.map((tile) => (
        <Card
          key={tile.id}
          className="tw-cursor-pointer tw-hover:tw-shadow-md tw-transition-shadow"
        >
          <CardHeader className="tw-pb-3">
            <div className="tw-flex tw-items-start tw-justify-between">
              <CardTitle className="tw-text-lg">{tile.name}</CardTitle>
              <div className="tw-flex tw-gap-1">
                <Badge variant={getStatusColor(tile.status)}>
                  {tile.status}
                </Badge>
                <Badge variant={getPriorityColor(tile.priority)}>
                  {tile.priority}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="tw-space-y-4">
            <div className="tw-space-y-2">
              <div className="tw-flex tw-justify-between tw-text-sm">
                <span className="tw-text-muted-foreground">Progress</span>
                <span>{tile.progress}%</span>
              </div>
              <Progress value={tile.progress} />
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-text-sm">
              <div>
                <span className="tw-text-muted-foreground">Material:</span>
                <p className="tw-font-medium">{tile.material}</p>
              </div>
              <div>
                <span className="tw-text-muted-foreground">Dimensions:</span>
                <p className="tw-font-medium">{tile.dimensions}</p>
              </div>
              <div>
                <span className="tw-text-muted-foreground">Assigned:</span>
                <p className="tw-font-medium">{tile.assignedTo}</p>
              </div>
              <div>
                <span className="tw-text-muted-foreground">Due:</span>
                <p className="tw-font-medium">{tile.dueDate}</p>
              </div>
            </div>

            <div className="tw-flex tw-gap-2 tw-pt-2">
              <Button variant="outline" size="sm" className="tw-flex-1">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="tw-flex-1">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </CardGridLayout>
  );
}
