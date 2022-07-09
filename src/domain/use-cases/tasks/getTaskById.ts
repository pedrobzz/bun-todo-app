import { Task } from "src/domain/entities";
import { BaseUseCaseResponse } from "../baseUseCaseResponse";

export interface GetTaskById {
  getTaskById: (id: string) => Promise<BaseUseCaseResponse<Task | undefined>>;
}
