import { Task } from "src/domain/entities";

export interface GetTaskById {
  getTaskById: (id: string) => Promise<Task | undefined>;
}
