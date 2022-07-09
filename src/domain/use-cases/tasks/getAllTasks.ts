import { Task } from "src/domain/entities";

export interface GetAllTasks {
  getAllTasks: () => Promise<Task[]>;
}
