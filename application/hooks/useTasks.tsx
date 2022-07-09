import { Task } from "domain/entities";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTasksContext } from "./useTasksContext";
let interval;
export const useTasks = () => {
  // Yeah, i know it isn't working as intended with the refetchTasks function,
  // but it's a quick fix to get the app working. I'm not sure why refetchTasks isn't
  // working, but i think its a bug from bun.sh
  const { taskManager, tasks, setTasks } = useTasksContext();

  const refetchTasks = async () => {
    const tasksResponse = await taskManager.getAllTasks();
    if (tasksResponse.success == true && tasksResponse.data !== tasks) {
      setTasks(tasksResponse.data);
    }
  };

  const updateTask = useCallback(
    async (
      id: string,
      task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
    ) => {
      await taskManager.updateTask(id, task);
      setTasks(prev => {
        const index = prev.findIndex(t => t.id === id);
        const newTasks = [...prev];
        newTasks[index] = { ...newTasks[index], ...task };
        return newTasks;
      });
      await refetchTasks();
    },
    [taskManager, tasks, setTasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await taskManager.deleteTask(id);
      setTasks(prev => {
        const newTasks = prev.filter(t => t.id !== id);
        return newTasks;
      });
      await refetchTasks();
    },
    [taskManager, refetchTasks],
  );

  const createTask = useCallback(
    async (
      task: Omit<Task, "id" | "createdAt" | "updatedAt"> & {
        status?: "TODO" | "Doing" | "Done" | "Canceled";
      },
    ) => {
      const response = await taskManager.createTask(task);
      setTasks(prevTasks => [
        ...prevTasks.filter(t => t.id !== response.data.id),
        response.data,
      ]);
      console.log("created");
      await refetchTasks();
    },
    [taskManager, tasks, setTasks],
  );

  return { tasks, updateTask, refetchTasks, deleteTask, createTask };
};
