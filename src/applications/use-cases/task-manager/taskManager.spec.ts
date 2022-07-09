import { describe, expect, it } from "bun:test";
import { Task } from "src/domain/entities";
import { TasksRepositorEntity } from "src/domain/repositories";
import {
  CreateTask,
  DeleteTask,
  GetAllTasks,
  GetTaskById,
  UpdateTask,
} from "src/domain/use-cases/tasks";

class MockTasksRepository implements TasksRepositorEntity {
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

class TaskManager
  implements CreateTask, GetTaskById, GetAllTasks, UpdateTask, DeleteTask
{
  constructor(private tasksRepository: TasksRepositorEntity) {}

  createTask: CreateTask["createTask"] = async task => {
    const obrigatory = ["title", "description", "dueDate"];
    const missing = obrigatory.filter(key => !Object.keys(task).includes(key));
    if (missing.length > 0) {
      return {
        status: 400,
        success: false,
        error: `Missing fields: ${missing.join(", ")}`,
      };
    }
    const newTask = await this.tasksRepository.createTask(task);
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
      ...(task ? { data: task } : { error: "Task not found" }),
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
    if (!currentTask) {
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

const makeSUT = (): TaskManager => {
  const tasksRepository = new MockTasksRepository();
  return new TaskManager(tasksRepository);
};

describe("Tasks Manager: Create Task", () => {
  it("Shouldn't be able to create a Task without title, description and dueDate", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    try {
      // @ts-expect-error: its a jest test...
      const task = await sut.createTask({});
      expect(task).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Missing fields: title, description, dueDate");
    }
  });

  it("Should be able to create a Task, even without status", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    // @ts-expect-error: its a jest test...
    const task = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
    });
    expect(task.title).toBe("Task 1");
    expect(task.description).toBe("Task 1 description");
    expect(task.dueDate).toBe(nextWeek.toISOString());
    expect(task.status).toBe("TODO");
  });

  it("Should be able to create a Task", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const task = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "Doing",
    });
    expect(task.title).toBe("Task 1");
    expect(task.description).toBe("Task 1 description");
    expect(task.dueDate).toBe(nextWeek.toISOString());
    expect(task.status).toBe("Doing");
  });
});

describe("Tasks Manager: Get Tasks", () => {
  it("Shouldn't be able to get a Task by Id if it doesn't exist", async () => {
    const sut = makeSUT();
    const task = await sut.getTaskById("123");
    expect(task).toBe(undefined);
  });

  it("Should be able to get a Task by ID", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const task = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "Doing",
    });
    const taskById = await sut.getTaskById(task.id);
    expect(taskById).toBe(task);
  });

  it("Should be able to retrieve 0 tasks if it doesn't has one", async () => {
    const sut = makeSUT();
    const tasks = await sut.getAllTasks();
    expect(tasks.length).toBe(0);
  });

  it("Should be able to retrieve all tasks", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const task1 = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "Doing",
    });
    const task2 = await sut.createTask({
      title: "Task 2",
      description: "Task 2 description",
      dueDate: nextWeek.toISOString(),
      status: "Doing",
    });
    const tasks = await sut.getAllTasks();
    expect(tasks.length).toBe(2);
    expect(tasks.find(t => t.id === task1.id)).toBe(task1);
    expect(tasks.find(t => t.id === task2.id)).toBe(task2);
  });
});

describe("Tasks Manager: Update Task", () => {
  it("Shouldn't be able to update a Task if it doesn't exist", async () => {
    const sut = makeSUT();
    try {
      const task = await sut.updateTask("123", {
        title: "Task 1",
      });
      expect(task).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Task with id 123 not found");
    }
  });

  it("Shouldn't be able to update forbidden fields (id, createdAt, updatedAt)", async () => {
    const sut = makeSUT();
    const now = new Date();
    try {
      const updatedTask = await sut.updateTask("123", {
        // @ts-expect-error: its a jest test...
        id: "123",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
      expect(updatedTask).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Forbidden fields: id, createdAt, updatedAt");
    }
  });

  it("Should be able to update a Task", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const task = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "TODO",
    });
    const updatedTask = await sut.updateTask(task.id, {
      title: "Task 1 updated",
      description: "Task 1 description updated",
      dueDate: nextMonth.toISOString(),
      status: "Doing",
    });
    expect(updatedTask.title).toBe("Task 1 updated");
    expect(updatedTask.description).toBe("Task 1 description updated");
    expect(updatedTask.dueDate).toBe(nextMonth.toISOString());
    expect(updatedTask.status).toBe("Doing");

    const taskById = await sut.getTaskById(task.id);
    expect(taskById).toBe(updatedTask);
  });
});

describe("Tasks Manager: Delete Task", () => {
  it("Should be able to delete a Task", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const task = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "TODO",
    });
    await sut.deleteTask(task.id);
    const taskById = await sut.getTaskById(task.id);
    expect(taskById).toBe(undefined);
  });
});
