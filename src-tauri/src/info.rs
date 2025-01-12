use std::{thread, time::Duration};

use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, System, MINIMUM_CPU_UPDATE_INTERVAL};

pub fn start_monitoring_processes() -> System {
    let mut sys = System::new_all();
    sys.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing().with_cpu().with_memory(),
    );

    thread::sleep(MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing().with_cpu().with_memory(),
    );
    sys
}

fn get_processes() {
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
        for (pid, process) in sys.processes() {
            if process.cpu_usage() / (sys.cpus().len() as f32) > 0.01 {
                println!(
                    "[{}] name: {:?} memory: {:?}MB CPU {:.2?}%",
                    process.pid(),
                    process.name(),
                    process.memory() / (1024 * 1024),
                    process.cpu_usage() / (sys.cpus().len() as f32),
                );
            }
        }
        println!("--------------------------------");
        thread::sleep(delay);
    }
}
