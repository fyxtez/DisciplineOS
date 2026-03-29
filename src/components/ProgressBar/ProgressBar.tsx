import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  completed: number;
  total: number;
  allDone: boolean;
}

export default function ProgressBar({
  completed,
  total,
  allDone,
}: ProgressBarProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const label = allDone
    ? "all done — nice work"
    : completed === 0
      ? "let's get started"
      : "keep going";

  return (
    <div className={styles.section}>
      <div className={styles.info}>
        <span
          className={styles.count}
          style={{ color: allDone ? "var(--accent)" : "var(--text-primary)" }}
        >
          {completed}
          <span className={styles.total}>/{total}</span>
        </span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
