use std::sync::{Arc, Mutex};

use anyhow::Result;
use info::start_monitoring_processes;
use serde::Serialize;
use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, System, MINIMUM_CPU_UPDATE_INTERVAL};
use tauri::{Manager, State};

mod info;

struct SharedSystem(Arc<Mutex<System>>);

#[derive(Debug, Serialize)]
struct ProcessDetails {
    pid: String,
    name: String,
    memory: u64,
    cpu: f32,
}

#[derive(Debug, Serialize)]
struct ProcessDetailsError {
    message: String,
}

#[tauri::command(async)]
fn get_process_details(
    state: State<'_, SharedSystem>,
) -> Result<Vec<ProcessDetails>, ProcessDetailsError> {
    let mut sys = state.0.lock().unwrap();
    sys.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing().with_cpu().with_memory(),
    );
    std::thread::sleep(MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing().with_cpu().with_memory(),
    );
    let mut process_list: Vec<ProcessDetails> = Vec::new();
    for process in sys.processes().values() {
        let process_details = ProcessDetails {
            pid: process.pid().to_string(),
            name: process.name().to_str().unwrap().to_string(),
            memory: process.memory() / (1024 * 1024),
            cpu: process.cpu_usage() / (sys.cpus().len() as f32),
        };
        process_list.push(process_details)
    }

    Ok(process_list)
}

#[tauri::command]
fn quit(app: tauri::AppHandle) {
    println!("Quitting application");
    app.app_handle().exit(1);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_gamepad::init())
        .invoke_handler(tauri::generate_handler![get_process_details, quit])
        .setup(|app| {
            let sys = start_monitoring_processes();
            app.manage(SharedSystem(Arc::new(Mutex::new(sys))));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
