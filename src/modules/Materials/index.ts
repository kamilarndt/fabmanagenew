// Components
export { MaterialCard } from "./components/MaterialCard";
export { MaterialList } from "./components/MaterialList";
export { MaterialStats } from "./components/MaterialStats";

// Views
export { MaterialsView } from "./views/MaterialsView";

// Hooks
export {
  useMaterialQuery,
  useMaterialStatsQuery,
  useMaterialsQuery,
} from "./hooks/useMaterialsQuery";

// Services
export { materialsService } from "./services/materialsService";

// Types
export type {
  Material,
  MaterialCategory,
  MaterialFilters,
  MaterialStats as MaterialStatsType,
  MaterialStock,
} from "./types";
