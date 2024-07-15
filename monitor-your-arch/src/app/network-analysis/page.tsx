"use client";
import { useState, useEffect, useCallback } from "react";
import {
  startSniffing,
  stopSniffing,
  getTrafficStats,
  TrafficStat,
} from "@/lib/tauri";
import TrafficChart from "./TrafficChart";
import ControlPanel from "./ControlPanel";

interface TrafficData {
  upload: number[];
  download: number[];
  labels: string[];
}

export default function Home() {
  const [sniffing, setSniffing] = useState(false);
  const [trafficData, setTrafficData] = useState<TrafficData>({
    upload: [],
    download: [],
    labels: [],
  });

  const handleToggleSniffing = useCallback(async () => {
    if (sniffing) {
      await stopSniffing();
      setSniffing(false);
    } else {
      handleReset(); // Clear the existing data first
      await startSniffing();
      setSniffing(true);
    }
  }, [sniffing]);

  const handleReset = useCallback(() => {
    setTrafficData({
      upload: [],
      download: [],
      labels: [],
    });
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = ["Time", "Upload (bytes)", "Download (bytes)"];
    const rows = trafficData.labels.map((label, index) => [
      label,
      trafficData.upload[index],
      trafficData.download[index],
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "network_traffic_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [trafficData]);

  const fetchTrafficStats = useCallback(async () => {
    if (!sniffing) return;

    const stats: TrafficStat[] = await getTrafficStats();
    const validStats = stats.filter(
      (stat) => stat.upload !== 0 || stat.download !== 0
    );

    const upload = validStats.map((stat) => stat.upload);
    const download = validStats.map((stat) => stat.download);

    const timestamps = validStats.map(
      (stat) => new Date(stat.timestamp * 1000)
    );

    const labels = timestamps.map((timestamp) => {
      const date = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
      return date.toString();
    });

    console.log("Raw upload data:", upload);
    console.log("Raw download data:", download);

    setTrafficData({
      upload: upload,
      download: download,
      labels: labels,
    });

    setTimeout(fetchTrafficStats, 1000);
  }, [sniffing]);

  useEffect(() => {
    if (sniffing) {
      fetchTrafficStats();
    }

    return () => {
      setSniffing(false);
    };
  }, [sniffing, fetchTrafficStats]);

  return (
    <div>
      <ControlPanel
        sniffing={sniffing}
        handleToggleSniffing={handleToggleSniffing}
        handleReset={handleReset}
        handleExportCSV={handleExportCSV}
        dataAvailable={trafficData.labels.length > 0}
      />
      <TrafficChart trafficData={trafficData} />
    </div>
  );
}
