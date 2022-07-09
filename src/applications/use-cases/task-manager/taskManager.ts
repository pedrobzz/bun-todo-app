import { TasksRepositorEntity } from "../../../domain/repositories";
import {
  CreateTask,
  DeleteTask,
  GetAllTasks,
  GetTaskById,
  UpdateTask,
} from "../../../domain/use-cases/tasks";

export class TaskManager
  implements CreateTask, GetTaskById, GetAllTasks, UpdateTask, DeleteTask
{
  constructor(private tasksRepository: TasksRepositorEntity) {}

  createTask: CreateTask["createTask"] = async task => {
    const obrigatory = ["title", "description", "dueDate"];
    const missing = obrigatory.filter(
      key => !Object.keys(task).includes(key) || !task[key],
    );
    if (missing.length > 0) {
      return {
        status: 400,
        success: false,
        error: `Missing fields: ${missing.join(", ")}`,
      };
    }
    const newTask = await this.tasksRepository.createTask({
      ...task,
      status: task.status || "TODO",
    });
    return {
      status: 200,
      success: true,
      data: newTask,
    };
  };

  getTaskById: GetTaskById["getTaskById"] = async taskId => {
    const task = await this.tasksRepository.getTaskById(taskId);
    return {
      status: task ? 200 : 404,
      success: task ? true : false,
      ...(task
        ? { data: task }
        : { error: `Task with id ${taskId} not found` }),
    };
  };

  getAllTasks: GetAllTasks["getAllTasks"] = async () => {
    const tasks = await this.tasksRepository.getAllTasks();
    return {
      status: 200,
      success: true,
      data: tasks,
    };
  };

  updateTask: UpdateTask["updateTask"] = async (id, task) => {
    const forbiddenUpdate = ["id", "createdAt", "updatedAt"];
    const forbidden = forbiddenUpdate.filter(key =>
      Object.keys(task).includes(key),
    );
    if (forbidden.length > 0) {
      return {
        status: 400,
        success: false,
        error: `Forbidden fields: ${forbidden.join(", ")}`,
      };
    }
    const currentTask = await this.getTaskById(id);
    if (!currentTask.success) {
      return {
        status: 404,
        success: false,
        error: `Task with id ${id} not found`,
      };
    }
    const updated = await this.tasksRepository.updateTask(id, task);
    return {
      status: 200,
      success: true,
      data: updated,
    };
  };

  deleteTask: DeleteTask["deleteTask"] = async taskId => {
    await this.tasksRepository.deleteTask(taskId);
    const byIdResponse = await this.getTaskById(taskId);
    if (byIdResponse.success) {
      return {
        status: 500,
        success: false,
        error: `Wasn't able to delete task with id ${taskId}. Please, try again`,
      };
    }
    return {
      status: 200,
      success: true,
    };
  };
}
