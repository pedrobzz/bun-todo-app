import { Task } from "domain/entities";
import React, { createContext, useEffect } from "react";
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
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TasksContext = createContext<TasksContextInterface>(null);

export const TasksContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTask] = React.useState<Task[]>([]);

  const contextValue = {
    taskManager: getTaskManager(),
    tasks,
    setTasks: setTask,
  };
  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  );
};
