"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandList,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getInterfaces } from "@/lib/tauri";

interface ControlPanelProps {
    sniffing: boolean;
    handleStartSniffing: (iface: string) => void;
    handleStopSniffing: () => void;
    dataAvailable: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    sniffing,
    handleStartSniffing,
    handleStopSniffing,
    dataAvailable,
}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [interfaces, setInterfaces] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchNetworkInterfaces = async () => {
            try {
                const info = await getInterfaces();
                setInterfaces(info);
                console.log(info); // Debug statement
            } catch (error) {
                console.error("Failed to fetch network interfaces", error);
            }
        };
        fetchNetworkInterfaces();
    }, []);

    const handleSelectInterface = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);
    };

    return (
        <div className="flex justify-center gap-3 py-5">
            <Button variant="outline" onClick={() => handleStartSniffing(value)}>
                Start Sniffing
            </Button>
            <Button variant="outline" onClick={handleStopSniffing}>
                Stop Sniffing
            </Button>
            <div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            style={{ width: '350px' }}
                            className="w-[200px] justify-between"
                        >
                            {value
                                ? interfaces.find((iface) => iface === value) || "Select interface..."
                                : "Select interface..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search interface..." />
                            <CommandEmpty>No interface found.</CommandEmpty>
                            <CommandGroup>
                                {interfaces.length > 0 ? (
                                    interfaces.map((iface, index) => (
                                        // eslint-disable-next-line react/jsx-key
                                        <CommandList>
                                            <CommandItem
                                                key={index}
                                                value={iface}
                                                onSelect={() => handleSelectInterface(iface)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === iface ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {iface}
                                            </CommandItem>

                                        </CommandList>))
                                ) : (
                                    <CommandEmpty>No interface available.</CommandEmpty>
                                )}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default ControlPanel;
