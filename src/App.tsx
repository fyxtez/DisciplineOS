import type { TaskFormData } from "./types";
import { useTasks } from "./hooks/useTasks";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import styles from "./App.module.css";

export default function App() {
  const {
    activeTasks,
    completedCount,
    totalCount,
    allDone,
    progress,
    getBlockTasks,
    getBlockProgress,
    toggleComplete,
    addTask,
    updateTask,
    deleteTask,
    isCompleted,
  } = useTasks();

  const handleEdit = (id: number, data: TaskFormData) => {
    updateTask(id, data);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Header />

        <ProgressBar
          completed={completedCount}
          total={totalCount}
          allDone={allDone}
        />

        <AddTask onAdd={addTask} />

        <TaskList
          getBlockTasks={getBlockTasks}
          getBlockProgress={getBlockProgress}
          isCompleted={isCompleted}
          onToggle={toggleComplete}
          onEdit={handleEdit}
          onDelete={deleteTask}
          isEmpty={activeTasks.length === 0}
        />

        {allDone && totalCount > 0 && (
          <div className={styles.allDone}>
            <span className={styles.allDoneText}>
              everything done for today
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
