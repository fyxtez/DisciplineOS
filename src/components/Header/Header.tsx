import styles from "./Header.module.css";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function getDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.greeting}>good {getGreeting()}</h1>
      <p className={styles.date}>{getDateString()}</p>
    </header>
  );
}
