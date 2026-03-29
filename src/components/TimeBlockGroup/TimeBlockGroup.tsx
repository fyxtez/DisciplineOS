import type { Task, TimeBlock, TaskFormData } from "../../types";
import TaskCard from "../TaskCard";
import styles from "./TimeBlockGroup.module.css";

interface BlockProgress {
  done: number;
  total: number;
  allDone: boolean;
}

interface TimeBlockGroupProps {
  block: TimeBlock;
  tasks: Task[];
  progress: BlockProgress | null;
  isCompleted: (id: number) => boolean;
  onToggle: (id: number) => void;
  onEdit: (id: number, data: TaskFormData) => void;
  onDelete: (id: number) => void;
}

export default function TimeBlockGroup({
  block,
  tasks,
  progress,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
}: TimeBlockGroupProps) {
  if (tasks.length === 0) return null;

  return (
    <div className={styles.group}>
      <div className={styles.header}>
        <div className={styles.labelRow}>
          <span className={styles.icon}>{block.icon}</span>
          <span className={styles.label}>{block.label}</span>
          <span className={styles.hours}>{block.hours}</span>
        </div>
        {progress && (
          <span
            className={styles.count}
            style={{
              color: progress.allDone
                ? "var(--accent)"
                : "var(--text-muted)",
            }}
          >
            {progress.done}/{progress.total}
          </span>
        )}
      </div>
      <div className={styles.list}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            completed={isCompleted(task.id)}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
