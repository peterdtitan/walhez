"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import Link from "next/link";
import { equipment } from "@/utils/data";

export default function EquipmentPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedEquipment = equipment[selectedIndex];

  const nextEquipment = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % equipment.length);
  };

  const prevEquipment = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? equipment.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen w-screen bg-hero-pattern px-2 pb-8 pt-2 md:pt-10 items-center justify-center">
      <div className="relative flex flex-col md:flex-row w-full mt-4 md:mt-0 md:h-[80%] max-w-6xl bg-white overflow-hidden">
        <motion.h1
          className="absolute top-0 md:top-2 left-8 text-center text-6xl md:text-8xl font-extrabold uppercase text-gray-300/30 z-0"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {selectedEquipment.name}
        </motion.h1>

        <div className="relative flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedEquipment.id}
              src={selectedEquipment.image}
              alt={selectedEquipment.name}
              className="w-full h-full object-cover md:w-[500px] rounded-lg md:rounded-none md:rounded-l-lg z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>

        <motion.div
          className="flex flex-col justify-between w-full md:w-1/3 bg-[#1E2D44] text-white z-10 p-4 md:p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-2xl font-bold">{selectedEquipment.name.toUpperCase()}</h2>
            <p className="text-gray-300">
              {selectedEquipment.company.toUpperCase()} - {selectedEquipment.model.toUpperCase()}
            </p>

            <div className="mt-4">
              <ul className="mt-2 space-y-2">
                {selectedEquipment.characteristics.map((char) => (
                  <li key={char.id} className="flex flex-col justify-between text-gray-200">
                    <span className=''>{char.title.toUpperCase()}:</span>
                    <span className="font-semibold text-primaryYellow">{char.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={prevEquipment}
              className=" flex items-center justify-center text-white px-4 py-2 rounded-lg hover:text-primaryYellow transition w-full "
            >
              <MdOutlineArrowBackIos size={60} />
            </button>
            <button
              onClick={nextEquipment}
              className="flex items-center justify-center text-white px-4 py-2 rounded-lg hover:text-primaryYellow transition w-full "
            >
              <MdOutlineArrowForwardIos size={60} />
            </button>
          </div>
        </motion.div>
      </div>
      <div className="mt-6 p-4 text-center bg-white/40 w-full max-w-6xl shadow-sm">
        <p className="text-gray-700 text-base md:text-lg">
          ⚠️ <span className="font-semibold">Limited Availability:</span> All
          equipment is subject to availability at the time of request.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block bg-primaryYellow text-[#1E2D44]/80 px-6 py-3  font-medium hover:bg-yellow-500 transition"
        >
          Make A Request
        </Link>
      </div>
    </div>
  );
}

