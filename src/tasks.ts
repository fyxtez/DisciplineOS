import { invoke } from "@tauri-apps/api/core";
import { Task } from "./types";

export async function getTasks(): Promise<Task[]> {
  console.log("calling get_tasks");
  return await invoke<Task[]>("get_tasks");
}

export async function saveTask(task: Task): Promise<Task[]> {
  console.log("calling save_task", task);
  return await invoke<Task[]>("save_task", { task });
}

export async function updateTask(task: Task): Promise<Task[]> {
  console.log("calling update_task", task);
  return await invoke<Task[]>("update_task", { task });
}

export async function removeTask(id: number): Promise<Task[]> {
  console.log("calling remove_task", id);
  return await invoke<Task[]>("remove_task", { id });
}