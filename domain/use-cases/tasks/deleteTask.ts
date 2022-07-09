import { BaseUseCaseResponse } from "../baseUseCaseResponse";

export interface DeleteTask {
  deleteTask: (id: string) => Promise<BaseUseCaseResponse<void>>;
}
