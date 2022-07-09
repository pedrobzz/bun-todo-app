import { Task } from "domain/entities";

export const TaskComponent: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className="p-5">
      <h1 className="text-2xl">{task.title}</h1>
      <p className="text-justify">{task.description}</p>
      <div>
        <p>{task.dueDate.split("T")[0]}</p>
        <p>{task.status}</p>
      </div>
    </div>
  );
};
