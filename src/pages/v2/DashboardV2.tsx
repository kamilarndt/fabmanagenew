import { DashboardPage } from "@/new-ui";
import { useMaterialsStore } from "@/stores/materialsStore";
import { useProjectsStore } from "@/stores/projectsStore";
import { useTilesStore } from "@/stores/tilesStore";
import * as React from "react";

export default function DashboardV2(): React.ReactElement {
  const { projects } = useProjectsStore();
  const { tiles } = useTilesStore();
  const { materials } = useMaterialsStore();

  const stats = React.useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const completedProjects = projects.filter(
      (p) => p.status === "done"
    ).length;
    const totalTiles = tiles.length;
    const completedTiles = tiles.filter((t) => t.status === "completed").length;
    const totalMaterials = materials.length;
    const lowStockMaterials = materials.filter(
      (m) => m.stock <= m.minStock
    ).length;

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const spentBudget = 0; // No spent field in current Project type

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTiles,
      completedTiles,
      totalMaterials,
      lowStockMaterials,
      totalBudget,
      spentBudget,
    };
  }, [projects, tiles, materials]);

  const recentActivities = React.useMemo(() => {
    const activities: Array<{
      id: string;
      type: "project" | "tile" | "material";
      title: string;
      description: string;
      timestamp: string;
      status?: string;
    }> = [];

    // Add recent project activities
    projects.slice(0, 3).forEach((project) => {
      activities.push({
        id: `project-${project.id}`,
        type: "project" as const,
        title: `Project "${project.name}" updated`,
        description: `Status changed to ${project.status}`,
        timestamp: "2 hours ago",
        status: project.status,
      });
    });

    // Add recent tile activities
    tiles.slice(0, 2).forEach((tile) => {
      activities.push({
        id: `tile-${tile.id}`,
        type: "tile" as const,
        title: `Tile "${tile.name}" completed`,
        description: `Status: ${tile.status}`,
        timestamp: "4 hours ago",
        status: tile.status,
      });
    });

    return activities.sort(() => Math.random() - 0.5).slice(0, 5);
  }, [projects, tiles]);

  const handleViewAll = (type: string) => {
    console.log(`View all ${type} clicked`);
    // Navigate to appropriate page
    switch (type) {
      case "projects":
        window.location.href = "/v2/projects";
        break;
      case "tiles":
        window.location.href = "/v2/tiles";
        break;
      case "materials":
        window.location.href = "/v2/materials";
        break;
      default:
        break;
    }
  };

  return (
    <DashboardPage
      stats={stats}
      recentActivities={recentActivities}
      onViewAll={handleViewAll}
    />
  );
}
