import { GroupsView } from "../modules/groups";

export default function GroupsNew() {
  const handleViewGroup = (group: any) => {
    console.log("View group:", group);
  };

  const handleEditGroup = (group: any) => {
    console.log("Edit group:", group);
  };

  const handleManageMembers = (group: any) => {
    console.log("Manage members for group:", group);
  };

  const handleAddGroup = () => {
    console.log("Add group");
  };

  return (
    <GroupsView
      onViewGroup={handleViewGroup}
      onEditGroup={handleEditGroup}
      onManageMembers={handleManageMembers}
      onAddGroup={handleAddGroup}
    />
  );
}
