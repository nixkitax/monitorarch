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

  const handleStartSniffing = useCallback(async () => {
    await startSniffing();
    setSniffing(true);
  }, []);

  const handleStopSniffing = useCallback(async () => {
    await stopSniffing();
    setSniffing(false);
  }, []);

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
    <div className="mx-24 ">
      <h1 className="font-bold text-3xl ">
        Real-time network traffic line chart
      </h1>
      <ControlPanel
        sniffing={sniffing}
        handleStartSniffing={handleStartSniffing}
        handleStopSniffing={handleStopSniffing}
        dataAvailable={trafficData.labels.length > 0}
      />
      <TrafficChart trafficData={trafficData} />
    </div>
  );
}
