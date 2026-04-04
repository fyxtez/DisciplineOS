import { useState, useCallback, useEffect } from "react";
import type { Task, TimeBlockKey, TaskFormData } from "../types";
import {
  getTasks,
  saveTask as saveTaskCmd,
  updateTask as updateTaskCmd,
  removeTask as removeTaskCmd,
} from "../tasks";

interface BlockProgress {
  done: number;
  total: number;
  allDone: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      try {
        const storedTasks = await getTasks();
        if (!cancelled) {
          setTasks(storedTasks);
        }
      } catch (error) {
        console.error("failed to load tasks:", error);
      }
    };

    void loadTasks();

    const interval = window.setInterval(() => {
      void loadTasks();
    }, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const activeTasks = tasks.filter((t) => t.active);
  const completedCount = activeTasks.filter((t) => t.complete).length;
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
    (blockKey: TimeBlockKey): BlockProgress | null => {
      const bt = getBlockTasks(blockKey);
      if (bt.length === 0) return null;

      const done = bt.filter((t) => t.complete).length;

      return {
        done,
        total: bt.length,
        allDone: done === bt.length,
      };
    },
    [getBlockTasks]
  );

  const toggleComplete = useCallback(async (id: number) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;

    const updatedTask: Task = {
      ...current,
      complete: !current.complete,
    };

    try {
      const nextTasks = await updateTaskCmd(updatedTask);
      setTasks(nextTasks);
    } catch (error) {
      console.error("failed to toggle task completion:", error);
    }
  }, [tasks]);

  const addTask = useCallback(async (formData: TaskFormData) => {
    if (!formData.title.trim()) return;

    const subtaskList = formData.subtasks
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const now = Date.now();

    const task: Task = {
      id: now,
      title: formData.title.trim(),
      subtasks: subtaskList,
      reminder: formData.reminder,
      timeBlock: formData.timeBlock,
      active: true,
      complete: false,
      createdAt: now,
    };

    try {
      const nextTasks = await saveTaskCmd(task);
      setTasks(nextTasks);
    } catch (error) {
      console.error("failed to save task:", error);
      throw error;
    }
  }, []);

  const updateTask = useCallback(
    async (id: number, formData: TaskFormData) => {
      if (!formData.title.trim()) return;

      const current = tasks.find((t) => t.id === id);
      if (!current) return;

      const subtaskList = formData.subtasks
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedTask: Task = {
        ...current,
        title: formData.title.trim(),
        subtasks: subtaskList,
        reminder: formData.reminder,
        timeBlock: formData.timeBlock,
      };

      try {
        const nextTasks = await updateTaskCmd(updatedTask);
        setTasks(nextTasks);
      } catch (error) {
        console.error("failed to update task:", error);
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(async (id: number) => {
    try {
      const nextTasks = await removeTaskCmd(id);
      setTasks(nextTasks);
    } catch (error) {
      console.error("failed to delete task:", error);
    }
  }, []);

  const isCompleted = useCallback(
    (id: number) => {
      const task = tasks.find((t) => t.id === id);
      return !!task?.complete;
    },
    [tasks]
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