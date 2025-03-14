"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCog } from "react-icons/fa";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-hero-pattern bg-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">    
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="text-yellow-500"
          >
            <FaCog className="text-9xl" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }} 
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-3 right-[-60px] text-yellow-500"
          >
            <FaCog className="text-7xl" />
          </motion.div>
        </div>

        <p className="text-lg md:text-xl font-semibold tracking-wide text-[#1E2D44]/90 text-center">
          We are currently updating our projects list. <br />
          Check back soon!
        </p>
      </div>
    </div>
  );
}
