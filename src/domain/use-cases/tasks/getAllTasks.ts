import { Task } from "src/domain/entities";
import { BaseUseCaseResponse } from "../baseUseCaseResponse";

export interface GetAllTasks {
  getAllTasks: () => Promise<BaseUseCaseResponse<Task[]>>;
}
