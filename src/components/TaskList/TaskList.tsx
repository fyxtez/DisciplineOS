import type { Task, TimeBlockKey, TaskFormData } from "../../types";
import { TIME_BLOCKS } from "../../data/defaults";
import TimeBlockGroup from "../TimeBlockGroup";
import styles from "./TaskList.module.css";

interface BlockProgress {
  done: number;
  total: number;
  allDone: boolean;
}

interface TaskListProps {
  getBlockTasks: (key: TimeBlockKey) => Task[];
  getBlockProgress: (key: TimeBlockKey) => BlockProgress | null;
  isCompleted: (id: number) => boolean;
  onToggle: (id: number) => void;
  onEdit: (id: number, data: TaskFormData) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isEmpty: boolean;
}

export default function TaskList({
  getBlockTasks,
  getBlockProgress,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isEmpty,
}: TaskListProps) {
  if (isEmpty) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>no tasks yet</p>
        <p className={styles.emptyHint}>
          add a few daily essentials to get started
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {TIME_BLOCKS.map((block) => (
        <TimeBlockGroup
  key={block.key}
  block={block}
  tasks={getBlockTasks(block.key)}
  progress={getBlockProgress(block.key)}
  isCompleted={isCompleted}
  onToggle={onToggle}
  onEdit={onEdit}
  onDelete={onDelete}
  onMoveUp={onMoveUp}
  onMoveDown={onMoveDown}
        />
      ))}
    </div>
  );
}
