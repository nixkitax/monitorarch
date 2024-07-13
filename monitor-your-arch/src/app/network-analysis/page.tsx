"use client";
import { useState, useEffect } from "react";
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

  const handleStart = async () => {
    handleReset(); // Clear the existing data first
    await startSniffing();
    setSniffing(true);
  };

  const handleStop = async () => {
    await stopSniffing();
    setSniffing(false);
  };

  const handleReset = () => {
    setTrafficData({
      upload: [],
      download: [],
      labels: [],
    });
  };

  const handleExportCSV = () => {
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
  };

  const applyMovingAverage = (data: number[], windowSize: number) => {
    if (data.length < windowSize) {
      return data;
    }
    const smoothedData = [];
    for (let i = 0; i < data.length - windowSize + 1; i++) {
      const window = data.slice(i, i + windowSize);
      const average =
        window.reduce((sum, value) => sum + value, 0) / windowSize;
      smoothedData.push(average);
    }
    return smoothedData;
  };

  const fetchTrafficStats = async () => {
    const stats: TrafficStat[] = await getTrafficStats();
    const validStats = stats.filter(
      (stat) => stat.upload !== 0 || stat.download !== 0
    );

    const upload = validStats.map((stat) => stat.upload);
    const download = validStats.map((stat) => stat.download);

    const timestamps = validStats.map((stat) => stat.timestamp * 1000);

    const labels = timestamps.map((timestamp) => {
      const date =
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds();
      return date.toString();
    });

    // Apply smoothing
    const smoothedUpload = applyMovingAverage(upload, 3); // Adjust window size as needed
    const smoothedDownload = applyMovingAverage(download, 3);

    setTrafficData((prevData) => ({
      upload: [...prevData.upload, ...smoothedUpload],
      download: [...prevData.download, ...smoothedDownload],
      labels: [...prevData.labels, ...labels],
    }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (sniffing) {
      interval = setInterval(fetchTrafficStats, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sniffing]);

  return (
    <div>
      <ControlPanel
        sniffing={sniffing}
        handleStart={handleStart}
        handleStop={handleStop}
        handleReset={handleReset}
        handleExportCSV={handleExportCSV}
        dataAvailable={trafficData.labels.length > 0}
      />
      <TrafficChart trafficData={trafficData} />
    </div>
  );
}
