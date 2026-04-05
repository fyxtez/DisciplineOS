use chrono::{Local, Timelike};
use serde::{Deserialize, Serialize};
use std::{
    fs,
    path::{Path, PathBuf},
    time::Duration,
};
use tauri::{AppHandle, Manager};
use tokio::time::sleep;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: i64,
    pub title: String,
    pub subtasks: Vec<String>,
    pub reminder: String,
    pub time_block: TimeBlockKey,
    pub active: bool,
    #[serde(default)] // Added so deserialization does not fail
    pub complete: bool,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum TimeBlockKey {
    Morning,
    Midday,
    Evening,
}
fn ensure_app_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("failed to resolve app data dir: {e}"))?;

    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| format!("failed to create app data dir: {e}"))?;
    }

    Ok(dir)
}

fn tasks_file_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = ensure_app_data_dir(app)?;
    Ok(dir.join("tasks.json"))
}

fn read_tasks_from_file(path: &Path) -> Result<Vec<Task>, String> {
    if !path.exists() {
        return Ok(Vec::new());
    }

    let content =
        fs::read_to_string(path).map_err(|e| format!("failed to read tasks file: {e}"))?;

    if content.trim().is_empty() {
        return Ok(Vec::new());
    }

    serde_json::from_str::<Vec<Task>>(&content)
        .map_err(|e| format!("failed to parse tasks json: {e}"))
}

fn write_tasks_atomic(path: &Path, tasks: &[Task]) -> Result<(), String> {
    let parent = path
        .parent()
        .ok_or_else(|| "tasks file has no parent directory".to_string())?;

    if !parent.exists() {
        fs::create_dir_all(parent).map_err(|e| format!("failed to create parent dir: {e}"))?;
    }

    let temp_path = parent.join("tasks.tmp.json");

    let json = serde_json::to_string_pretty(tasks)
        .map_err(|e| format!("failed to serialize tasks: {e}"))?;

    fs::write(&temp_path, json).map_err(|e| format!("failed to write temp tasks file: {e}"))?;

    fs::rename(&temp_path, path)
        .map_err(|e| format!("failed to replace tasks file atomically: {e}"))?;

    Ok(())
}

fn reset_tasks_file(path: &Path) -> Result<(), String> {
    if !path.exists() {
        return Ok(());
    }

    let content =
        fs::read_to_string(path).map_err(|e| format!("failed to read tasks file: {e}"))?;

    if content.trim().is_empty() {
        return Ok(());
    }

    let mut tasks: Vec<Task> =
        serde_json::from_str(&content).map_err(|e| format!("failed to parse tasks json: {e}"))?;

    for task in &mut tasks {
        task.complete = false;
    }

    write_tasks_atomic(path, &tasks)
}

pub fn start_daily_reset_timer(app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let mut last_reset_day: Option<String> = None;

        loop {
            let now = Local::now();
            let today = now.format("%Y-%m-%d").to_string();

            if now.hour() == 0 && now.minute() <= 2 && last_reset_day.as_deref() != Some(&today) {
                match tasks_file_path(&app) {
                    Ok(path) => {
                        if let Err(err) = reset_tasks_file(&path) {
                            eprintln!("daily reset failed: {err}");
                        } else {
                            println!("daily reset completed for {}", today);
                            last_reset_day = Some(today.clone());

                            if let Ok(reset_path) = last_reset_path(&app) {
                                if let Err(err) = fs::write(&reset_path, &today) {
                                    eprintln!("failed to write reset date: {err}");
                                }
                            }
                        }
                    }
                    Err(err) => {
                        eprintln!("failed to resolve tasks path for daily reset: {err}");
                    }
                }
            }

            sleep(Duration::from_secs(30)).await;
        }
    });
}

pub fn run_reset_check_now(app: &tauri::AppHandle) {
    let today = Local::now().format("%Y-%m-%d").to_string();

    let reset_path = match last_reset_path(app) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("failed to resolve reset path: {e}");
            return;
        }
    };

    let last = fs::read_to_string(&reset_path).ok();

    if last.as_deref() != Some(&today) {
        if let Ok(tasks_path) = tasks_file_path(app) {
            if let Err(err) = reset_tasks_file(&tasks_path) {
                eprintln!("startup reset failed: {err}");
                return;
            }
        }

        if let Err(err) = fs::write(&reset_path, &today) {
            eprintln!("failed to write reset date: {err}");
        }

        println!("startup daily reset executed");
    }
}

fn last_reset_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = ensure_app_data_dir(app)?;
    Ok(dir.join("last_reset.txt"))
}

#[tauri::command]
pub fn get_tasks(app: AppHandle) -> Result<Vec<Task>, String> {
    let path = tasks_file_path(&app)?;
    read_tasks_from_file(&path)
}

#[tauri::command]
pub fn save_task(app: AppHandle, task: Task) -> Result<Vec<Task>, String> {
    let path = tasks_file_path(&app)?;
    let mut tasks = read_tasks_from_file(&path)?;

    if tasks.iter().any(|t| t.id == task.id) {
        return Err(format!("task with id {} already exists", task.id));
    }

    tasks.push(task);
    write_tasks_atomic(&path, &tasks)?;

    Ok(tasks)
}

#[tauri::command]
pub fn update_task(app: AppHandle, task: Task) -> Result<Vec<Task>, String> {
    let path = tasks_file_path(&app)?;
    let mut tasks = read_tasks_from_file(&path)?;

    let existing = tasks.iter_mut().find(|t| t.id == task.id);

    match existing {
        Some(current) => {
            *current = task;
            write_tasks_atomic(&path, &tasks)?;
            Ok(tasks)
        }
        None => Err(format!("task with id {} not found", task.id)),
    }
}

#[tauri::command]
pub fn remove_task(app: AppHandle, id: i64) -> Result<Vec<Task>, String> {
    let path = tasks_file_path(&app)?;
    let mut tasks = read_tasks_from_file(&path)?;

    let before = tasks.len();
    tasks.retain(|t| t.id != id);

    if tasks.len() == before {
        return Err(format!("task with id {} not found", id));
    }

    write_tasks_atomic(&path, &tasks)?;
    Ok(tasks)
}
