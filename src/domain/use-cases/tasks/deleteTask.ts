export interface DeleteTask {
  deleteTask: (id: string) => Promise<void>;
}
