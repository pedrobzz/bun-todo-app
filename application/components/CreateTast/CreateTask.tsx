import { useTasks } from "application/hooks/useTasks";
import { Task } from "domain/entities";
import { useState } from "react";

export const CreateTaskComponent: React.FC = () => {
  const allStatus: Array<Task["status"]> = [
    "TODO",
    "Doing",
    "Done",
    "Canceled",
  ];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"TODO" | "Doing" | "Done" | "Canceled">(
    "TODO",
  );
  const { createTask } = useTasks();
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <form
        className="max-w-[50%]"
        onSubmit={e => {
          e.preventDefault();
          createTask({
            title,
            description,
            dueDate,
            status,
          });
          setTitle("");
          setDescription("");
          setDueDate("");
          setStatus("TODO");
        }}
      >
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Post Title
        </label>
        <input
          id="title"
          type="text"
          className="border-transparent block text-sm font rounded p-2.5 w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Title"
          value={title}
          onChange={e => {
            // @ts-expect-error: Bun doesnt recognize this
            setTitle(e.target.value);
          }}
          required
        />
        <label
          htmlFor="content"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Task Content
        </label>
        <textarea
          id="content"
          className="block p-2.5 rounded w-full text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Task Content..."
          value={description}
          onChange={e => {
            // @ts-expect-error: Bun doesnt recognize this
            setDescription(e.target.value);
          }}
          required
        />
        <input
          id="dueDate"
          type="date"
          className="border-2 border-transparent border-b-white rounded-lg bg-transparent "
          value={dueDate}
          onChange={e => {
            // @ts-expect-error: Bun doesnt recognize this
            setDueDate(e.target.value);
          }}
          required
        />

        <select
          id="status-select"
          name="status select"
          className="border-2 border-transparent border-b-white rounded-lg bg-transparent"
          value={status}
          onChange={e => {
            // @ts-expect-error: Bun doesnt recognize this
            setStatus(e.target.value);
          }}
        >
          {allStatus.map(status => {
            return (
              <option value={status} key={`${status}-option`}>
                {status}
              </option>
            );
          })}
        </select>
        <br />
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-2 py-1 bg-green-200 rounded-lg hover:bg-green-400"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
