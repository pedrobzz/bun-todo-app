import { describe, expect, it } from "bun:test";
import { Task } from "../../../domain/entities";
import { TasksRepositorEntity } from "../../../domain/repositories";
import { TaskManager } from "./taskManager";

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

const makeSUT = (): TaskManager => {
  const tasksRepository = new MockTasksRepository();
  return new TaskManager(tasksRepository);
};

describe("Tasks Manager: Create Task", () => {
  it("Shouldn't be able to create a Task without title, description and dueDate", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    // @ts-expect-error: its a jest test...
    const task = await sut.createTask({});
    expect(task.status).toBe(400);
    expect(task.success).toBe(false);
    expect(task.error).toBe("Missing fields: title, description, dueDate");
  });

  it("Should be able to create a Task, even without status", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    // @ts-expect-error: its a jest test...
    const taskResponse = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
    });
    expect(taskResponse.status).toBe(200);
    const task = taskResponse.data;
    expect(task.title).toBe("Task 1");
    expect(task.description).toBe("Task 1 description");
    expect(task.dueDate).toBe(nextWeek.toISOString());
    expect(task.status).toBe("TODO");
  });

  it("Should be able to create a Task", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const taskResponse = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "Doing",
    });
    expect(taskResponse.status).toBe(200);
    const task = taskResponse.data;
    expect(task.title).toBe("Task 1");
    expect(task.description).toBe("Task 1 description");
    expect(task.dueDate).toBe(nextWeek.toISOString());
    expect(task.status).toBe("Doing");
  });
});

describe("Tasks Manager: Get Tasks", () => {
  it("Shouldn't be able to get a Task by Id if it doesn't exist", async () => {
    const sut = makeSUT();
    const taskResponse = await sut.getTaskById("123");
    expect(taskResponse.status).toBe(404);
    expect(taskResponse.success).toBe(false);
    expect(taskResponse.error).toBe("Task with id 123 not found");
    expect(taskResponse.data).toBe(undefined);
  });

  it("Should be able to get a Task by ID", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const taskResponse = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "Doing",
    });
    const task = taskResponse.data;
    const taskByIdResponse = await sut.getTaskById(task.id);
    expect(taskByIdResponse.status).toBe(200);
    expect(taskByIdResponse.success).toBe(true);
    expect(taskByIdResponse.data).toBe(task);
  });

  it("Should be able to retrieve 0 tasks if it doesn't has one", async () => {
    const sut = makeSUT();
    const tasksResponse = await sut.getAllTasks();
    expect(tasksResponse.status).toBe(200);
    expect(tasksResponse.success).toBe(true);
    expect(tasksResponse.data.length).toBe(0);
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
    const tasksResponse = await sut.getAllTasks();
    expect(tasksResponse.status).toBe(200);
    expect(tasksResponse.success).toBe(true);
    expect(tasksResponse.data.length).toBe(2);
    expect(tasksResponse.data[0]).toBe(task1.data);
    expect(tasksResponse.data[1]).toBe(task2.data);
  });
});

describe("Tasks Manager: Update Task", () => {
  it("Shouldn't be able to update a Task if it doesn't exist", async () => {
    const sut = makeSUT();
    const taskResponse = await sut.updateTask("123", {
      title: "Task 1",
    });
    expect(taskResponse.status).toBe(404);
    expect(taskResponse.success).toBe(false);
    expect(taskResponse.error).toBe(`Task with id 123 not found`);
  });

  it("Shouldn't be able to update forbidden fields (id, createdAt, updatedAt)", async () => {
    const sut = makeSUT();
    const now = new Date();
    const updatedTaskResponse = await sut.updateTask("123", {
      // @ts-expect-error: its a jest test...
      id: "123",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    expect(updatedTaskResponse.status).toBe(400);
    expect(updatedTaskResponse.success).toBe(false);
    expect(updatedTaskResponse.error).toBe(
      "Forbidden fields: id, createdAt, updatedAt",
    );
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
    const updatedTaskResponse = await sut.updateTask(task.data.id, {
      title: "Task 1 updated",
      description: "Task 1 description updated",
      dueDate: nextMonth.toISOString(),
      status: "Doing",
    });
    expect(updatedTaskResponse.status).toBe(200);
    expect(updatedTaskResponse.success).toBe(true);
    const updatedTask = updatedTaskResponse.data;
    expect(updatedTask.title).toBe("Task 1 updated");
    expect(updatedTask.description).toBe("Task 1 description updated");
    expect(updatedTask.dueDate).toBe(nextMonth.toISOString());
    expect(updatedTask.status).toBe("Doing");

    const taskById = await sut.getTaskById(task.data.id);
    expect(taskById.data).toBe(updatedTask);
  });
});

describe("Tasks Manager: Delete Task", () => {
  it("Should be able to delete a Task", async () => {
    const sut = makeSUT();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const taskResponse = await sut.createTask({
      title: "Task 1",
      description: "Task 1 description",
      dueDate: nextWeek.toISOString(),
      status: "TODO",
    });
    await sut.deleteTask(taskResponse.data.id);
    const taskByIdResponse = await sut.getTaskById(taskResponse.data.id);
    expect(taskByIdResponse.status).toBe(404);
    expect(taskByIdResponse.success).toBe(false);
    expect(taskByIdResponse.error).toBe(
      `Task with id ${taskResponse.data.id} not found`,
    );
  });
});
