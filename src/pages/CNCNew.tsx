import { CNCView } from "../modules/cnc";

export default function CNCNew() {
  const handleViewTask = (task: any) => {
    console.log("View task:", task);
  };

  const handleStartTask = (task: any) => {
    console.log("Start task:", task);
  };

  const handlePauseTask = (task: any) => {
    console.log("Pause task:", task);
  };

  const handleCompleteTask = (task: any) => {
    console.log("Complete task:", task);
  };

  const handleAddTask = () => {
    console.log("Add task");
  };

  return (
    <CNCView
      onViewTask={handleViewTask}
      onStartTask={handleStartTask}
      onPauseTask={handlePauseTask}
      onCompleteTask={handleCompleteTask}
      onAddTask={handleAddTask}
    />
  );
}
