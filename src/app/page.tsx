"use client";
import { Task } from "@/models/Task";

import { useState, useEffect } from "react";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<Task >({
    title: "",
    description: "",
    id: 0,
    completed: false,
  });

  useEffect(() => {
    // try to load from local storage
    const tasksJson = localStorage.getItem("tasks");
    if (tasksJson) {
      setTasks(
        JSON.parse(tasksJson).map((task: any) => {
          return new Task(
            task.id,
            task.title,
            task.description,
            task.completed
          );
        })
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  /////////////taks action /////////////
  const addTask = () => {
    if (!input?.title) {
      return;
    }

    let maxId = 0;
    tasks.forEach((task) => {
      if (task.id > maxId) {
        maxId = task.id;
      }
    });

    const newTask = {
      id: maxId + 1,
      title: input.title,
      description: input.description,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput({
      title: "",
      description: "",
      id: 0,
      completed: false,
    });

  };

  const toggleTask = (e: any, task: Task)=>{
    const newTasks = tasks.map((t) => {
      if (t.id === task.id) {
        t.completed = e.target.checked;
      }
      return t;
    });
    setTasks(newTasks);
  }

  const deleteTask = (task: Task) => {
    const newTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(newTasks);
  };
  const onTitleChange = (e:any) => {
    setInput({ ...input, title: e.target.value});
  }
  const onDescriptionChange = (e:any) => {
    setInput({ ...input, description: e.target.value });
  }
  /////////////render /////////////
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none m-2"
          placeholder="Add a new task"
          value={input?.title}
          onChange={(e) => onTitleChange(e)}
        />
        <input
          type="text"
          className="flex-1 p-2 border rounded-r-lg focus:outline-none m-2"
          placeholder="Description"
          value={input?.description}
          onChange={(e) => onDescriptionChange(e)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg m-2"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {tasks?.map((task) => (
          <li key={task.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex items-center">
              <div className="min-w-0 flex-auto">
                <p className={task.completed ? "line-through text-sm/6 font-semibold text-gray-900" : "text-sm/6 font-semibold text-gray-900"}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => toggleTask(e, task)}
                  />
                  {task.title}
                  <button
                  className="text-red-500 text-xs/5 font-semibold m-2"
                  onClick={() => deleteTask(task)}
                >
                  Delete
                </button>
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {task.description}
                </p>
                
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
