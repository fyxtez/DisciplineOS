import { useState, type KeyboardEvent } from "react";
import type { Task, TaskFormData } from "../../types";
import TimeBlockSelector from "../TimeBlockSelector";
import { ClockIcon } from "../Icons";
import styles from "./EditTask.module.css";

interface EditTaskProps {
  task: Task;
  onSave: (id: number, data: TaskFormData) => void;
  onCancel: () => void;
}

export default function EditTask({ task, onSave, onCancel }: EditTaskProps) {
  const [title, setTitle] = useState(task.title);
  const [subtasks, setSubtasks] = useState(task.subtasks.join("\n"));
  const [reminder, setReminder] = useState(task.reminder);
  const [timeBlock, setTimeBlock] = useState(task.timeBlock);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(task.id, { title, subtasks, reminder, timeBlock });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className={styles.card}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className={styles.input}
        autoFocus
      />
      <textarea
        placeholder="subtasks (one per line)"
        value={subtasks}
        onChange={(e) => setSubtasks(e.target.value)}
        className={`${styles.input} ${styles.textarea}`}
      />
      <div>
        <div className={styles.fieldLabel}>time of day</div>
        <TimeBlockSelector value={timeBlock} onChange={setTimeBlock} size="small" />
      </div>
      <div className={styles.row}>
        <div className={styles.reminderGroup}>
          <ClockIcon />
          <input
            type="time"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className={styles.timeInput}
          />
        </div>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            cancel
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            save
          </button>
        </div>
      </div>
    </div>
  );
}
