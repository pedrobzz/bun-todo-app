import { useTasks } from "application/hooks/useTasks";
import { Task } from "domain/entities";
import { useState } from "react";

export const TaskComponent: React.FC<{ task: Task }> = ({ task }) => {
  const { deleteTask, updateTask } = useTasks();
  const colors = {
    TODO: "bg-purple-400",
    Doing: "bg-yellow-400",
    Done: "bg-green-400",
    Canceled: "bg-red-400",
  };
  return (
    <div className={`m-2 p-3 ${colors[task.status]}`}>
      <div className="flex justify-between">
        <h1 className="text-1xl font-bold">{task.title}</h1>
        <h1
          className="font-bold bg-red-600 flex justify-center items-center px-2 rounded-md hover:bg-red-800 cursor-pointer"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          X
        </h1>
      </div>
      <p className="text-justify">{task.description}</p>
      <div className="flex mx-5 justify-between">
        <input
          id="date"
          type="date"
          value={task.dueDate.split("T")[0]}
          className="border-2 border-transparent border-b-white rounded-lg bg-transparent"
          onChange={e => {
            // @ts-expect-error: Bun doesnt recognize this
            const value: string = e.target.value;
            const dt = new Date(value).toISOString();
            console.log(dt);
            updateTask(task.id, { dueDate: dt });
          }}
        />
        <div>
          <select
            id="status-select"
            name="status select"
            value={task.status}
            onChange={e => {
              // @ts-expect-error: Bun doesnt recognize this
              const value: Task["status"] = e.target.value;
              console.log(value);
              updateTask(task.id, { status: value });
            }}
          >
            {Object.keys(colors).map(c => {
              return (
                <option value={c} key={`${task.id}-option-${c}`}>
                  {c}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};
