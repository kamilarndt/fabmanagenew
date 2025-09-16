// Components
export { default as ProjectCard } from "./components/ProjectCard";
export { ProjectList } from "./components/ProjectList";
export { ProjectStats } from "./components/ProjectStats";

// Views
export { ProjectsView } from "./views/ProjectsView";

// Hooks
export {
  useProjectQuery,
  useProjectStatsQuery,
  useProjectsQuery,
} from "./hooks/useProjectsQuery";

// Services
export { projectsService } from "./services/projectsService";

// Types
export type {
  Project,
  ProjectFilters,
  ProjectModule,
  ProjectStats as ProjectStatsType,
  ProjectTile,
} from "./types";
