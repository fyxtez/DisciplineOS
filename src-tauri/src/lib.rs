pub mod task;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            task::start_daily_reset_timer(app.handle().clone());
            task::run_reset_check_now(&handle);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            task::get_tasks,
            task::save_task,
            task::update_task,
            task::remove_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
