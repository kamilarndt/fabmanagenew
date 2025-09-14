import { GroupList } from "../components/GroupList";
import { useGroupsQuery } from "../hooks/useGroupsQuery";

interface GroupsViewProps {
  onViewGroup?: (group: any) => void;
  onEditGroup?: (group: any) => void;
  onManageMembers?: (group: any) => void;
  onAddGroup?: () => void;
}

export function GroupsView({
  onViewGroup,
  onEditGroup,
  onManageMembers,
  onAddGroup,
}: GroupsViewProps) {
  const { data: groups = [], error } = useGroupsQuery();

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Error loading groups: {error.message}</p>
      </div>
    );
  }

  return (
    <GroupList
      groups={groups}
      onViewGroup={onViewGroup}
      onEditGroup={onEditGroup}
      onManageMembers={onManageMembers}
      onAddGroup={onAddGroup}
    />
  );
}
