import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Progress } from "@/new-ui/atoms/Progress/Progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { SearchBox } from "@/new-ui/molecules/SearchBox/SearchBox";
import { Select, type SelectOption } from "@/new-ui/molecules/Select/Select";
import { CardGridLayout } from "@/new-ui/templates/CardGridLayout/CardGridLayout";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface Tile {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "on-hold";
  progress: number;
  material: string;
  dimensions: string;
  priority: "low" | "medium" | "high";
  assignedTo: string;
  dueDate: string;
  project: string;
}

export interface TilesPageProps {
  tiles: Tile[];
  onTileClick?: (tileId: string) => void;
  onAddTile?: () => void;
  onEditTile?: (tileId: string) => void;
  onDeleteTile?: (tileId: string) => void;
  className?: string;
}

export function TilesPage({
  tiles,
  onTileClick,
  onAddTile,
  onEditTile,
  onDeleteTile,
  className,
}: TilesPageProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

  const statusOptions: SelectOption[] = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
  ];

  const priorityOptions: SelectOption[] = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const filteredTiles = React.useMemo(() => {
    return tiles.filter((tile) => {
      const matchesSearch =
        tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || tile.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || tile.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tiles, searchTerm, statusFilter, priorityFilter]);

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

  const breadcrumbs = [{ label: "Tiles" }];

  const actions = <Button onClick={onAddTile}>Add Tile</Button>;

  return (
    <div className={cn("tw-space-y-6", className)}>
      <CardGridLayout
        title="Tiles"
        description="Manage and track tile production progress"
        breadcrumbs={breadcrumbs}
        actions={actions}
        gridCols={3}
      >
        {/* Filters */}
        <Card className="tw-col-span-full">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
              <SearchBox
                placeholder="Search tiles, materials, or assignees..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
              <Select
                options={priorityOptions}
                value={priorityFilter}
                onChange={setPriorityFilter}
                placeholder="Filter by priority"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tile Cards */}
        {filteredTiles.map((tile) => (
          <Card
            key={tile.id}
            className="tw-cursor-pointer tw-hover:tw-shadow-md tw-transition-shadow"
            onClick={() => onTileClick?.(tile.id)}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="tw-flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTile?.(tile.id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="tw-flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTile?.(tile.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardGridLayout>
    </div>
  );
}
