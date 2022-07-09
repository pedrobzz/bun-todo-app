import { Task } from "src/domain/entities";

export interface CreateTask {
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt"> & {
      status?: "TODO" | "Doing" | "Done" | "Canceled";
    },
  ) => Promise<Task>;
}
