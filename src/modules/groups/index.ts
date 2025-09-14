// Components
export { GroupCard } from "./components/GroupCard";
export { GroupList } from "./components/GroupList";

// Views
export { GroupsView } from "./views/GroupsView";

// Hooks
export {
  useGroupQuery,
  useGroupStatsQuery,
  useGroupsQuery,
} from "./hooks/useGroupsQuery";

// Services
export { groupsService } from "./services/groupsService";

// Types
export type {
  Group,
  GroupFilters,
  GroupMember,
  GroupStats as GroupStatsType,
} from "./types";
