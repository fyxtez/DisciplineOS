import styles from "./SubtaskList.module.css";

interface SubtaskListProps {
  subtasks: string[];
  dimmed?: boolean;
}

export default function SubtaskList({ subtasks, dimmed = false }: SubtaskListProps) {
  if (subtasks.length === 0) return null;

  return (
    <ul className={styles.list}>
      {subtasks.map((text, i) => (
        <li key={i} className={styles.item}>
          <span className={styles.dot} />
          <span className={dimmed ? styles.textDimmed : styles.text}>
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}
