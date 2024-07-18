"use client"
import { useState, useCallback, useEffect } from "react";
import { getInterfaces } from "@/lib/tauri";

interface SystemInfo {
    [key: string]: string;
}

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
        <div>
            <h1>Network Interfaces</h1>
            {networkInterface ? (
                <table>
                    <thead>
                        <tr>
                            <th>Interface Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {networkInterface.map((iface: any, index: any) => (
                            <tr key={index}>
                                <td>{iface}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
