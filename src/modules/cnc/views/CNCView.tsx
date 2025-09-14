import { CNCQueue } from "../components/CNCQueue";
import { CNCStats } from "../components/CNCStats";
import { useCNCQuery } from "../hooks/useCNCQuery";

interface CNCViewProps {
  onViewTask?: (task: any) => void;
  onStartTask?: (task: any) => void;
  onPauseTask?: (task: any) => void;
  onCompleteTask?: (task: any) => void;
  onAddTask?: () => void;
}

export function CNCView({
  onViewTask,
  onStartTask,
  onPauseTask,
  onCompleteTask,
  onAddTask,
}: CNCViewProps) {
  const { data: tasks = [], isLoading, error } = useCNCQuery();

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Error loading CNC tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <CNCStats tasks={tasks} />
      <div style={{ marginTop: 24 }}>
        <CNCQueue
          tasks={tasks}
          loading={isLoading}
          onViewTask={onViewTask}
          onStartTask={onStartTask}
          onPauseTask={onPauseTask}
          onCompleteTask={onCompleteTask}
          onAddTask={onAddTask}
        />
      </div>
    </div>
  );
}
