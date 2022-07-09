import { Task } from "domain/entities";
import { TaskComponent } from "../Task/Task";

export const TaskColumns: React.FC<{ status: string; allTasks: Task[] }> = ({
  status,
  allTasks,
}) => {
  return (
    <div className="flex flex-col min-w-[20%]" key={`${status}-col`}>
      <h1 className="text-2xl font-bold text-center">{status}</h1>
      {allTasks
        .filter(t => t.status === status)
        .map(task => {
          return (
            <TaskComponent task={task} key={`task-${status}-${task.id}`} />
          );
        })}
    </div>
  );
};
