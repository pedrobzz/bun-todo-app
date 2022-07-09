import { Task } from "domain/entities";
import { BaseUseCaseResponse } from "../baseUseCaseResponse";

export interface CreateTask {
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt"> & {
      status?: "TODO" | "Doing" | "Done" | "Canceled";
    },
  ) => Promise<BaseUseCaseResponse<Task>>;
}
