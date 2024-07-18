"use client";
import { useCallback, useEffect, useState } from "react";
import { getOverviewSystem } from "@/lib/tauri";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SystemInfo {
  [key: string]: string;
}

export default function Home() {
  const [systemInfo, setSystemInfo] = useState<string>("");

  const fetchSystemInfo = useCallback(async () => {
    try {
      const info = await getOverviewSystem();
      setSystemInfo(info);
      console.log(info);
    } catch (error) {
      console.error("Failed to fetch system info:", error);
    }
  }, []);

  useEffect(() => {
    fetchSystemInfo();
  }, [fetchSystemInfo]);

  const parseSystemInfo = (info: string): SystemInfo => {
    const lines = info.split("\n");
    const infoObj: SystemInfo = {};
    lines.forEach((line) => {
      const [key, value] = line.split(": ");
      if (key && value) {
        infoObj[key.trim()] = value.trim();
      }
    });
    return infoObj;
  };

  const systemInfoObj = parseSystemInfo(systemInfo);

  return (
    <div className="mx-24">
      <h1 className="font-bold text-3xl mb-10">Overview</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Property</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(systemInfoObj).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
