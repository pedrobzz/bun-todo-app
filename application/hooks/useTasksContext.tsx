import { useContext } from "react";
import { TasksContext } from "../context/tasksContext";
import { TaskManager } from "../use-cases/task-manager/taskManager";

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  return context;
};
