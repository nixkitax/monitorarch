"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import Mac from "@/components/mac";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className="flex flex-row w-full just gap-12">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-5xl font-bold -ml-2.5">Analyze Your Best Friend</p>
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
