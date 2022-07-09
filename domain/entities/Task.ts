export type Task = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "Doing" | "Done" | "Canceled";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};
