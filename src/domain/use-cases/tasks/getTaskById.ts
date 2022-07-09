import { Task } from "src/domain/entities";

export interface getTaskById {
  getTaskById: (id: string) => Promise<Task>;
}
