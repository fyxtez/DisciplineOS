export type TimeBlockKey = "morning" | "midday" | "evening";

export interface TimeBlock {
  key: TimeBlockKey;
  label: string;
  icon: string;
  hours: string;
}

export interface Task {
  id: number;
  title: string;
  subtasks: string[];
  reminder: string;
  timeBlock: TimeBlockKey;
  active: boolean;
  complete: boolean;
  createdAt: number;
}

export interface TaskFormData {
  title: string;
  subtasks: string;
  reminder: string;
  timeBlock: TimeBlockKey;
}

export const EMPTY_FORM: TaskFormData = {
  title: "",
  subtasks: "",
  reminder: "",
  timeBlock: "morning",
};
