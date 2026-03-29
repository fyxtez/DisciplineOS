import { useState, useEffect } from "react";
import type { Task, TaskFormData } from "../../types";
import {
  CheckIcon,
  ClockIcon,
  ChevronIcon,
  EditIcon,
  TrashIcon,
} from "../Icons";
import SubtaskList from "../SubtaskList";
import EditTask from "../EditTask";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: Task;
  completed: boolean;
  onToggle: (id: number) => void;
  onEdit: (id: number, data: TaskFormData) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({
  task,
  completed,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const hasSubtasks = task.subtasks.length > 0;

  const handleToggle = () => {
    if (!completed) {
      setBouncing(true);
    }
    onToggle(task.id);
  };

  useEffect(() => {
    if (bouncing) {
      const timer = setTimeout(() => setBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [bouncing]);

  const handleSave = (id: number, data: TaskFormData) => {
    onEdit(id, data);
    setEditing(false);
  };

  if (editing) {
    return (
      <EditTask
        task={task}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  const cardClass = [
    styles.card,
    completed ? styles.cardDone : styles.cardActive,
  ].join(" ");

  return (
    <div className={cardClass}>
      <div
        className={styles.main}
        onClick={() => {
          if (hasSubtasks) {
            setExpanded(!expanded);
          }
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className={[
            styles.check,
            completed ? styles.checkDone : styles.checkEmpty,
            bouncing ? styles.checkBounce : "",
          ].join(" ")}
        >
          {completed && <CheckIcon />}
        </button>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <span className={completed ? styles.titleDone : styles.title}>
              {task.title}
            </span>

            {task.reminder && (
              <span className={styles.reminder}>
                <ClockIcon />
                <span className={styles.reminderText}>{task.reminder}</span>
              </span>
            )}
          </div>

          {hasSubtasks && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className={styles.expandBtn}
            >
              <ChevronIcon open={expanded} />
              <span className={styles.expandLabel}>
                {task.subtasks.length} detail
                {task.subtasks.length !== 1 ? "s" : ""}
              </span>
            </button>
          )}

          {hasSubtasks && expanded && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <SubtaskList subtasks={task.subtasks} dimmed={completed} />
            </div>
          )}
        </div>

        <div
          className={styles.actions}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            title="Edit"
          >
            <EditIcon />
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionDanger}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}