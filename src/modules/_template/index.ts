// Components
export { TemplateCard } from "./components/TemplateCard";
export { TemplateGrid } from "./components/TemplateGrid";
export { TemplateStats } from "./components/TemplateStats";

// Views
export { TemplateView } from "./views/TemplateView";

// Hooks
export {
  useTemplateEntityQuery,
  useTemplateQuery,
  useTemplateStatsQuery,
} from "./hooks/useTemplateQuery";

// Services
export { templateService } from "./services/templateService";

// Types
export type {
  BaseEntity,
  BaseFilters,
  BaseStats,
  TemplateEntity,
  TemplateFilters,
  TemplateStats as TemplateStatsType,
} from "./types";
