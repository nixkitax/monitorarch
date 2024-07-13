export interface TrafficData {
  upload: number[];
  download: number[];
  labels: string[];
}

export interface TrafficStat {
  upload: number;
  download: number;
  timestamp: number;
}

import { invoke } from "@tauri-apps/api/tauri";

export async function startSniffing() {
  return await invoke("start_sniffing");
}

export async function stopSniffing() {
  return await invoke("stop_sniffing");
}

export async function getTrafficStats(): Promise<TrafficStat[]> {
  return await invoke("get_traffic_stats");
}
