import { Task } from "domain/entities";
import { TasksRepositorEntity } from "domain/repositories";

export class TasksRepository implements TasksRepositorEntity {
  tasks: Task[] = [];
  getAllTasks = async () => {
    return this.tasks;
  };
  getTaskById = async (taskId: string) => {
    return this.tasks.find(task => task.id === taskId);
  };
  createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: Math.floor(Math.random() * 100000000).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  };
  updateTask = async (
    id: string,
    task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => {
    const updatedTask = {
      ...this.tasks.find(task => task.id === id),
      ...task,
      updatedAt: new Date().toISOString(),
    };
    const index = this.tasks.findIndex(task => task.id === id);
    this.tasks[index] = updatedTask;
    return updatedTask;
  };
  deleteTask = async (taskId: string) => {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  };
}
