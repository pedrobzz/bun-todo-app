import { Task } from "src/domain/entities";

export interface getAllTasks {
  getAllTasks: () => Promise<Task[]>;
}
