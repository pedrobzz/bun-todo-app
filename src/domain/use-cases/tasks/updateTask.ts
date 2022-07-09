import { Task } from "src/domain/entities";
import { BaseUseCaseResponse } from "../baseUseCaseResponse";

export interface UpdateTask {
  updateTask: (
    id: string,
    task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<BaseUseCaseResponse<Task>>;
}
