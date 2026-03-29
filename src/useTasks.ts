import { useState, useCallback } from "react";
import type { Task, TimeBlockKey, TaskFormData } from "../types";
import { DEFAULT_TASKS } from "../data/defaults";

interface TaskCompletions {
  [taskId: number]: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [completions, setCompletions] = useState<TaskCompletions>({});

  const activeTasks = tasks.filter((t) => t.active);
  const completedCount = activeTasks.filter((t) => completions[t.id]).length;
  const totalCount = activeTasks.length;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const getBlockTasks = useCallback(
    (blockKey: TimeBlockKey): Task[] => {
      return activeTasks.filter((t) => t.timeBlock === blockKey);
    },
    [activeTasks]
  );

  const getBlockProgress = useCallback(
    (blockKey: TimeBlockKey) => {
      const bt = getBlockTasks(blockKey);
      if (bt.length === 0) return null;
      const done = bt.filter((t) => completions[t.id]).length;
      return { done, total: bt.length, allDone: done === bt.length };
    },
    [getBlockTasks, completions]
  );

  const toggleComplete = useCallback((id: number) => {
    setCompletions((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const addTask = useCallback((formData: TaskFormData) => {
    if (!formData.title.trim()) return;
    const subtaskList = formData.subtasks
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const task: Task = {
      id: Date.now(),
      title: formData.title.trim(),
      subtasks: subtaskList,
      reminder: formData.reminder,
      timeBlock: formData.timeBlock,
      active: true,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: number, formData: TaskFormData) => {
    if (!formData.title.trim()) return;
    const subtaskList = formData.subtasks
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: formData.title.trim(),
              subtasks: subtaskList,
              reminder: formData.reminder,
              timeBlock: formData.timeBlock,
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (id: number) => !!completions[id],
    [completions]
  );

  return {
    tasks,
    activeTasks,
    completedCount,
    totalCount,
    allDone,
    progress,
    getBlockTasks,
    getBlockProgress,
    toggleComplete,
    addTask,
    updateTask,
    deleteTask,
    isCompleted,
  };
}
