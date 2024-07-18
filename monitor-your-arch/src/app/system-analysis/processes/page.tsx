"use client";
import { useCallback, useEffect, useState } from "react";
import { getProcesses } from "@/lib/tauri";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProcessInfo {
  pid: number;
  name: string;
  disk_usage: number;
}

export default function DynmamicPage() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  const fetchProcesses = useCallback(async () => {
    const data = await getProcesses();
    setProcesses(data);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProcesses();
    }, 2000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, [fetchProcesses]);

  return (
    <div className="mx-24">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Index</TableHead>
            <TableHead>Process Name</TableHead>
            <TableHead>Disk Usage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index}</TableCell>
              <TableCell>{process.name}</TableCell>
              <TableCell>{process.disk_usage} bytes used</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
