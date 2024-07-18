import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-regal-blue text-white overflow-hidden">
      <div className="flex px-8 pt-10 pb-12">
        <Link href="/">
          <p className="text-2xl font-semibold">MonitorArch</p>
        </Link>
      </div>
      <div className="flex flex-col px-6 gap-1">
        <div className="font-sans pl-2 text-sm pb-2 text-gray-400">MENU</div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <p className="text-left w-full text-sm font-medium ml-4 py-1.5">
              Network Analysis
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Network Analysis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/network-analysis">Real-time chart</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Register network session</DropdownMenuItem>
            <DropdownMenuItem>Import network session</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <p className="text-left w-full text-sm font-medium ml-4 py-1.5">
              System Analysis
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>System Analysis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/system-analysis/overview">Overview of system</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/system-analysis/processes">
                Processes & Disk Usage
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Others</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <p className="text-left w-full text-sm font-medium ml-4 py-1.5">
              System Logs
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>System Logs</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/network-analysis">Real-time chart</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Register network session</DropdownMenuItem>
            <DropdownMenuItem>Import network session</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
