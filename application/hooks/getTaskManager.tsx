import { useContext } from "react";
import { TasksContext } from "../context/tasksContext";
import { TaskManager } from "../use-cases/task-manager/taskManager";

export const getTasksManager = (): TaskManager => {
  const context = useContext(TasksContext);
  return context.taskManager;
};
