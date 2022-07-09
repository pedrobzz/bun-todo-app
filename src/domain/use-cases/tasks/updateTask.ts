import { Task } from "src/domain/entities";

export interface updateTask {
  updateTask: (
    id: string,
    task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Task>;
}
