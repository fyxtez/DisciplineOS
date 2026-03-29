import type { TimeBlockKey } from "../../types";
import { TIME_BLOCKS } from "../../data/defaults";
import styles from "./TimeBlockSelector.module.css";

interface TimeBlockSelectorProps {
  value: TimeBlockKey;
  onChange: (key: TimeBlockKey) => void;
  size?: "normal" | "small";
}

export default function TimeBlockSelector({
  value,
  onChange,
  size = "normal",
}: TimeBlockSelectorProps) {
  return (
    <div className={styles.selector}>
      {TIME_BLOCKS.map((block) => {
        const isActive = value === block.key;
        const sizeClass = size === "small" ? styles.small : styles.normal;
        const activeClass = isActive ? styles.active : styles.inactive;

        return (
          <button
            key={block.key}
            type="button"
            className={`${styles.option} ${sizeClass} ${activeClass}`}
            onClick={() => onChange(block.key)}
          >
            <span className={styles.icon}>{block.icon}</span>
            {block.label}
          </button>
        );
      })}
    </div>
  );
}
