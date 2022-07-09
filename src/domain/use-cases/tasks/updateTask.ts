import { Task } from "src/domain/entities";

export interface UpdateTask {
  updateTask: (
    id: string,
    task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Task>;
}
