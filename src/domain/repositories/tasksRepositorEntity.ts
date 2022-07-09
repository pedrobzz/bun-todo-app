import { Task } from "../entities";

export interface TasksRepositorEntity {
  getAllTasks: () => Promise<Task[]>;
  getTaskById: (id: string) => Promise<Task | undefined>;
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Task>;
  updateTask: (
    id: string,
    task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}
