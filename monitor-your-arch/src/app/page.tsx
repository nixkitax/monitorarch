"use client";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row w-full">
        <div className="flex-1 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl font-bold"
          >
            Analyze Your Best Friend
          </motion.h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {/* Placeholder per l'immagine */}
          <div className="w-96 h-96 bg-gray-200 flex items-center justify-center">
            <span>Image goes here</span>
          </div>
        </div>
      </div>
    </main>
  );
}
