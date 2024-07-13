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
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use std::thread;

#[derive(Clone, Serialize)]
struct TrafficStats {
    upload: usize,
    download: usize,
    timestamp: SystemTime,
}

impl Default for TrafficStats {
    fn default() -> Self {
        TrafficStats {
            upload: 0,
            download: 0,
            timestamp: UNIX_EPOCH,
        }
    }
}

#[derive(Default)]
struct PacketStore {
    packets: VecDeque<PacketInfo>,
    traffic_stats: VecDeque<TrafficStats>,
}

#[derive(Serialize, Clone)]
struct PacketInfo {
    source: String,
    destination: String,
    protocol: String,
    size: usize,
}

#[tauri::command]
fn start_sniffing(state: State<Arc<Mutex<bool>>>, packet_store: State<Arc<Mutex<PacketStore>>>) {
    let (tx, rx) = mpsc::channel();
    let state_clone = Arc::clone(&state);
    let packet_store_clone = Arc::clone(&packet_store);

    thread::spawn(move || {
        let interfaces = datalink::interfaces();
        for interface in interfaces.iter() {
            println!("Interfaccia trovata: {}", interface.name);
        }

        let interface_name = "en0".to_string();

        let interface = interfaces.into_iter()
            .find(|iface| iface.name == interface_name)
            .expect("Interfaccia Wi-Fi non trovata");

        let config = Config::default();
        let mut channel = match datalink::channel(&interface, config) {
            Ok(Ethernet(_, rx)) => rx,
            Ok(_) => {
                eprintln!("Canale non supportato");
                return;
            },
            Err(e) => {
                eprintln!("Errore nella creazione del canale: {}", e);
                return;
            },
        };

        loop {
            if !*state_clone.lock().unwrap() {
                break;
            }

            match channel.next() {
                Ok(packet) => {
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

                    let now = SystemTime::now();
                    if let Some(last_stat) = store.traffic_stats.back() {
                        if now.duration_since(last_stat.timestamp).unwrap() >= Duration::new(1, 0) {
                            let upload = store.packets.iter().filter(|p| p.source.starts_with("192.168")).map(|p| p.size).sum();
                            let download = store.packets.iter().filter(|p| p.destination.starts_with("192.168")).map(|p| p.size).sum();
                            store.traffic_stats.push_back(TrafficStats {
                                upload,
                                download,
                                timestamp: now,
                            });
                            if store.traffic_stats.len() > 60 {
                                store.traffic_stats.pop_front();
                            }
                        }
                    } else {
                        store.traffic_stats.push_back(TrafficStats {
                            upload: 0,
                            download: 0,
                            timestamp: now,
                        });
                    }

                    // Send updated stats through the channel
                    if let Err(err) = tx.send(store.traffic_stats.clone().into_iter().collect::<Vec<TrafficStats>>()) {
                        eprintln!("Error sending traffic stats: {}", err);
                    }
                },
                Err(e) => eprintln!("Errore nella ricezione del pacchetto: {}", e),
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

fn main() {
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(true)))
        .manage(Arc::new(Mutex::new(PacketStore::default())))
        .invoke_handler(tauri::generate_handler![start_sniffing, stop_sniffing, get_traffic_stats])
        .run(tauri::generate_context!())
        .expect("errore durante l'esecuzione di Tauri");
}
