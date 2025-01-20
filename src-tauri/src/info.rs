use std::{thread, time::Duration};

use serde::Serialize;
use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, System, MINIMUM_CPU_UPDATE_INTERVAL};
use tauri::{App, AppHandle, Emitter};

// pub fn start_monitoring_processes() -> System {
//     let mut sys = System::new_all();
//     sys.refresh_processes_specifics(
//         ProcessesToUpdate::All,
//         true,
//         ProcessRefreshKind::nothing().with_cpu().with_memory(),
//     );
//
//     thread::sleep(MINIMUM_CPU_UPDATE_INTERVAL);
//     sys.refresh_processes_specifics(
//         ProcessesToUpdate::All,
//         true,
//         ProcessRefreshKind::nothing().with_cpu().with_memory(),
//     );
//     sys
// }

#[derive(Debug, Serialize, Clone)]
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

pub async fn monitor_system(app: &AppHandle) {
    let delay = Duration::from_millis(5000);
    let mut sys = System::new_all();
    sys.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing().with_cpu().with_memory(),
    );
    loop {
        sys.refresh_processes_specifics(
            ProcessesToUpdate::All,
            true,
            ProcessRefreshKind::nothing().with_cpu().with_memory(),
        );
        let mut processes = Vec::new();
        for process in sys.processes().values() {
            if process.cpu_usage() / (sys.cpus().len() as f32) > 0.01 {
                // println!(
                //     "[{}] name: {:?} memory: {:?}MB CPU {:.2?}%",
                //     process.pid(),
                //     process.name(),
                //     process.memory() / (1024 * 1024),
                //     process.cpu_usage() / (sys.cpus().len() as f32),
                // );
                let process = ProcessDetails {
                    pid: process.pid().to_string(),
                    name: process.name().to_str().unwrap().to_string(),
                    memory: process.memory() / (1024 * 1024),
                    cpu: process.cpu_usage() / (sys.cpus().len() as f32),
                };
                processes.push(process);
            }
        }
        app.emit("system-update", processes).unwrap();
        println!("System update event sent");
        // println!("--------------------------------");
        tokio::time::sleep(delay).await;
    }
}
