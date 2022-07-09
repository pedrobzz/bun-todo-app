import React, { createContext } from "react";
import { TasksRepository } from "../repositories/tasksRepository";
import { TaskManager } from "../use-cases/task-manager/taskManager";

let taskManager: TaskManager;
const getTaskManager = (): TaskManager => {
  if (!taskManager) {
    taskManager = new TaskManager(new TasksRepository());
  }
  return taskManager;
};

interface TasksContextInterface {
  taskManager: TaskManager;
}

export const TasksContext = createContext<TasksContextInterface>(null);

export const TasksContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contextValue, setContextValue] = React.useState<TasksContextInterface>(
    {
      taskManager: getTaskManager(),
    },
  );
  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  );
};
