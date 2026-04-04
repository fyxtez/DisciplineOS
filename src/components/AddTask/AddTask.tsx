import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import type { TaskFormData, TimeBlockKey } from "../../types";
import { EMPTY_FORM } from "../../types";
import TimeBlockSelector from "../TimeBlockSelector";
import { PlusIcon, ClockIcon } from "../Icons";
import styles from "./AddTask.module.css";

interface AddTaskProps {
  onAdd: (data: TaskFormData) => Promise<void>;
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TaskFormData>({ ...EMPTY_FORM });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleAdd = async () => {
    if (!form.title.trim() || saving) return;

    try {
      setSaving(true);
      await onAdd(form);
      setForm({ ...EMPTY_FORM });
      setOpen(false);
    } catch (error) {
      console.error("failed to add task:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (saving) return;
    setForm({ ...EMPTY_FORM });
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleAdd();
    }
    if (e.key === "Escape") handleCancel();
  };

  if (!open) {
    return (
      <div className={styles.section}>
        <button onClick={() => setOpen(true)} className={styles.trigger}>
          <PlusIcon />
          <span className={styles.triggerLabel}>add task</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.form}>
        <input
          ref={inputRef}
          type="text"
          placeholder="task name"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <textarea
          placeholder="subtasks (one per line, optional)"
          value={form.subtasks}
          onChange={(e) => setForm({ ...form, subtasks: e.target.value })}
          className={`${styles.input} ${styles.textarea}`}
        />
        <div>
          <div className={styles.fieldLabel}>time of day</div>
          <TimeBlockSelector
            value={form.timeBlock}
            onChange={(key: TimeBlockKey) =>
              setForm({ ...form, timeBlock: key })
            }
          />
        </div>
        <div className={styles.row}>
          <div className={styles.reminderGroup}>
            <ClockIcon />
            <input
              type="time"
              value={form.reminder}
              onChange={(e) => setForm({ ...form, reminder: e.target.value })}
              className={styles.timeInput}
            />
          </div>
          <div className={styles.actions}>
            <button onClick={handleCancel} className={styles.cancelBtn}>
              cancel
            </button>
            <button
              onClick={() => void handleAdd()}
              className={styles.saveBtn}
              disabled={!form.title.trim() || saving}
              style={{ opacity: form.title.trim() ? 1 : 0.4 }}
            >
              {saving ? "saving..." : "add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}