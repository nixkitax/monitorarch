"use client"
import { useState, useCallback, useEffect } from "react";
import { getInterfaces } from "@/lib/tauri";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Home() {
    const [networkInterface, setNetworkInterface] = useState<any | null>(null);

    const fetchNetworkInterfaces = useCallback(async () => {
        try {
            const info = await getInterfaces();
            setNetworkInterface(info);
            console.log(info);
        } catch (error) {
            console.error("Failed to fetch network interfaces", error);
        }
    }, []);

    useEffect(() => {
        fetchNetworkInterfaces();
    }, [fetchNetworkInterfaces]);

    return (
        <div className="mx-24">
            <h1 className="font-bold text-3xl mb-10">Network Interfaces</h1>

                {
                    networkInterface ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Interface Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {networkInterface.map((iface: any, index: any) => (
                                    <TableRow key={index}>
                                        <TableCell>{iface}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                            <p>Loading...</p>
                    )
                }
            </div>
    );
}
