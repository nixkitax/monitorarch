"use client";
import { useEffect, useState } from "react";
import Mac from "@/components/mac";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function Home() {

    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const storedName = localStorage.getItem('userName');
            if (!storedName) {
                setIsDrawerOpen(true);
            } else {
                setName(storedName);
                setIsVisible(true);
            }
        }
    }, [isMounted]);

    const verifyName = () => {
        const storedName = localStorage.getItem('userName');
        if (storedName && storedName === name) {
            return true;
        }
        return false;
    };

    const handleDrawerSubmit = () => {
        if (name) {
            localStorage.setItem('userName', name);
            if (verifyName()) {
                setIsDrawerOpen(false);
                setIsVisible(true);
            } else {
                alert('There was an error saving your name. Please try again.');
            }
        } else {
            alert('Please enter your name');
        }
    };

    if (!isVisible) {
        return (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Welcome, this is MonitorArch! {`What's`} your name? 🥰</DrawerTitle>
                        <DrawerDescription>You can take care of your architecture here!</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 mb-4 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <DrawerFooter>
                        <Button variant="outline" onClick={handleDrawerSubmit}>Submit</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <div className="flex flex-row w-full just gap-12">
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-5xl font-bold -ml-2.5">Analyze Your Best Friend {localStorage.getItem('userName')}</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-96 h-96 bg-gray-200 flex items-center justify-center">
                        <Mac />
                    </div>
                </div>
            </div>
        </main>
    );
}
