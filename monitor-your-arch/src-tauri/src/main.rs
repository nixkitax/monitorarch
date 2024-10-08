extern crate pnet;

use pnet::datalink::{self, Channel::Ethernet, Config};
use pnet::packet::{Packet};
use pnet::packet::ethernet::{EthernetPacket};
use pnet::packet::ipv4::Ipv4Packet;
use pnet::packet::tcp::TcpPacket;
use pnet::packet::udp::UdpPacket;
use serde::Serialize;
use std::sync::{Arc, Mutex, mpsc};
use tauri::State;
use std::collections::VecDeque;
use std::time::{SystemTime, UNIX_EPOCH};
use std::thread;
use sysinfo::System;

#[derive(Clone, Serialize)]
struct TrafficStats {
    upload: usize,
    download: usize,
    timestamp: u64,
}

impl Default for TrafficStats {
    fn default() -> Self {
        TrafficStats {
            upload: 0,
            download: 0,
            timestamp: UNIX_EPOCH.elapsed().unwrap().as_secs(),
        }
    }
}

#[derive(Default)]
struct PacketStore {
    packets: VecDeque<PacketInfo>,
    traffic_stats: VecDeque<TrafficStats>,
}
#[derive(Debug)]
#[derive(Serialize, Clone)]
struct PacketInfo {
    source: String,
    destination: String,
    protocol: String,
    size: usize,
}

#[derive(Serialize, Clone)]
struct ProcessInfo {
    pid: i32,
    name: String,
    disk_usage: u64,
}

#[tauri::command]
fn start_sniffing(
    state: State<Arc<Mutex<bool>>>,
    packet_store: State<Arc<Mutex<PacketStore>>>,
    interface_name: String,
) {
    let mut sniffing = state.lock().unwrap();
    *sniffing = true;

    // get system info
    let mut sys = System::new_all();
    sys.refresh_all();
    let os = System::name().unwrap_or_default();

    println!("{}", os);

    let (tx, rx) = mpsc::channel();
    let state_clone = Arc::clone(&state);
    let packet_store_clone = Arc::clone(&packet_store);
    println!("{}", interface_name);
    thread::spawn(move || {
        let interfaces = datalink::interfaces();

        let interface = if os == "Windows" {
            for interface in interfaces.iter() {
                println!("Found interface: {}", interface.description);
            }
        
            interfaces.into_iter()
                .find(|iface| iface.description == interface_name)
                .expect("Specified interface not found")
        } else {
            for interface in interfaces.iter() {
                println!("Found interface: {}", interface.name);
            }
        
            interfaces.into_iter()
                .find(|iface| iface.name == interface_name)
                .expect("Specified interface not found")
        };
        
        println!("Using interface: {}", interface.name);        let config = Config::default();
        let mut channel = match datalink::channel(&interface, config) {
            Ok(Ethernet(_, rx)) => rx,
            Ok(_) => {
                eprintln!("Unsupported channel");
                return;
            },
            Err(e) => {
                eprintln!("Failed to create channel: {}", e);
                return;
            },
        };

        let mut current_upload = 0;
        let mut current_download = 0;

        loop {
            if !*state_clone.lock().unwrap() {
                break;
            }
            println!("sniffing 1");
            match channel.next() {
                Ok(packet) => {
                    println!("{}", packet.len());
                    let ethernet_packet = EthernetPacket::new(packet).unwrap();
                    let packet_info = match ethernet_packet.get_ethertype() {
                        pnet::packet::ethernet::EtherTypes::Ipv4 => {
                            let ipv4_packet = Ipv4Packet::new(ethernet_packet.payload()).unwrap();
                            let size = ipv4_packet.packet().len();
                            match ipv4_packet.get_next_level_protocol() {
                                pnet::packet::ip::IpNextHeaderProtocols::Tcp => {
                                    let _tcp_packet = TcpPacket::new(ipv4_packet.payload()).unwrap();
                                    PacketInfo {
                                        source: ipv4_packet.get_source().to_string(),
                                        destination: ipv4_packet.get_destination().to_string(),
                                        protocol: "TCP".to_string(),
                                        size,
                                    }
                                },
                                pnet::packet::ip::IpNextHeaderProtocols::Udp => {
                                    let _udp_packet = UdpPacket::new(ipv4_packet.payload()).unwrap();
                                    PacketInfo {
                                        source: ipv4_packet.get_source().to_string(),
                                        destination: ipv4_packet.get_destination().to_string(),
                                        protocol: "UDP".to_string(),
                                        size,
                                    }
                                },
                                _ => continue,
                            }
                        },
                        pnet::packet::ethernet::EtherTypes::Ipv6 => continue,
                        _ => continue,
                    };

                    let mut store = packet_store_clone.lock().unwrap();
                    if store.packets.len() > 1000 {
                        store.packets.pop_front();
                    }
                    store.packets.push_back(packet_info.clone());
                    // Controlla pacchetti piccoli
                    if packet_info.size < 100 {
                        println!("Skipping small packet: {}", packet_info.size);
                        continue;
                    }

                    if packet_info.source.starts_with("192.168") {
                        current_upload += packet_info.size * 8; // Convert bytes to bits
                    }
                    if packet_info.destination.starts_with("192.168") {
                        current_download += packet_info.size * 8; // Convert bytes to bits
                    }

                    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
                    if let Some(last_stat) = store.traffic_stats.back() {
                        println!("Last timestamp: {}, Current timestamp: {}", last_stat.timestamp, now);
                        if now > last_stat.timestamp + 1 {  // Aggiorna ogni secondo
                            store.traffic_stats.push_back(TrafficStats {
                                upload: current_upload,
                                download: current_download,
                                timestamp: now,
                            });
                            println!("Upload: {} bits Download: {} bits", current_upload, current_download);
                            current_upload = 0;  // Resetta contatore upload
                            current_download = 0;  // Resetta contatore download
                        }
                    } else {
                        println!("No previous traffic stats found, starting fresh.");
                        store.traffic_stats.push_back(TrafficStats {
                            upload: current_upload,
                            download: current_download,
                            timestamp: now,
                        });
                    }

                    // Invia aggiornamenti tramite il canale
                    if let Err(err) = tx.send(store.traffic_stats.clone().into_iter().collect::<Vec<TrafficStats>>()) {
                        eprintln!("Error sending traffic stats: {}", err);
                    }
                },
                Err(e) => eprintln!("Failed to receive packet: {}", e),
            }
        }
    });

    let packet_store_main = Arc::clone(&packet_store);
    thread::spawn(move || {
        while let Ok(updated_stats) = rx.recv() {
            let mut store = packet_store_main.lock().unwrap();
            store.traffic_stats = VecDeque::from(updated_stats);
        }
    });
}

#[tauri::command]
fn stop_sniffing(state: State<Arc<Mutex<bool>>>) {
    let mut sniffing = state.lock().unwrap();
    *sniffing = false;
}

#[tauri::command]
fn get_traffic_stats(packet_store: State<Arc<Mutex<PacketStore>>>) -> Vec<TrafficStats> {
    let store = packet_store.lock().unwrap();
    store.traffic_stats.clone().into_iter().collect()
}

#[tauri::command]
fn get_system_info() -> String {
    let mut sys = System::new_all();
    sys.refresh_all();

    let info = format!(
        "System name: {}\nKernel version: {}\nOS version: {}\nTotal memory: {} MB\nUsed memory: {} MB\nTotal swap: {} MB\nUsed swap: {} MB\nNumber of CPUs: {}",
        System::name().unwrap_or_default(),
        System::kernel_version().unwrap_or_default(),
        System::os_version().unwrap_or_default(),
        sys.total_memory(),
        sys.used_memory(),
        sys.total_swap(),
        sys.used_swap(),
        sys.cpus().len(),
    );
    println!("System info retrieved: {}", info);

    info
}

#[tauri::command]
fn get_processes() -> Vec<ProcessInfo> {
    let sys = System::new_all();
    sys.processes().iter().map(|(pid, process)| ProcessInfo {
        pid: pid.as_u32() as i32,
        name: process.name().to_string(),
        disk_usage: process.disk_usage().total_written_bytes,
    }).collect()
}

#[tauri::command]
fn get_interfaces() -> Vec<String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    let os = System::name().unwrap_or_default();
    if os == "Windows" {
        let interfaces = datalink::interfaces();
        println!("interfaces: {:?}", interfaces);
        let interfaces_name: Vec<String> = interfaces
            .iter()
            .map(|interface| interface.description.clone())
            .collect();
        println!("interfaces: {:?}", interfaces_name);
        interfaces_name
    } else {
        let interfaces = datalink::interfaces();
        println!("interfaces: {:?}", interfaces);
        let interfaces_name: Vec<String> = interfaces
            .iter()
            .map(|interface| interface.name.clone())
            .collect();
        println!("interfaces: {:?}", interfaces_name);
        interfaces_name
    }
}

fn main() {
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(true)))
        .manage(Arc::new(Mutex::new(PacketStore::default())))
        .invoke_handler(tauri::generate_handler![
            start_sniffing,
            stop_sniffing,
            get_traffic_stats,
            get_system_info,
            get_processes,
            get_interfaces,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
