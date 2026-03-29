"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

export default function EquipmentShowcase({ equipment }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!equipment.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-hero-pattern px-4 py-10">
        <div className="max-w-xl rounded-[2rem] bg-white/90 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold text-slate-900">No equipment yet</h1>
          <p className="mt-4 text-slate-600">
            The equipment database is empty. Add records from the admin area to populate this page.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-primaryYellow px-6 py-3 font-semibold text-[#1E2D44]"
          >
            Contact Walhez
          </Link>
        </div>
      </div>
    );
  }

  const selectedEquipment = equipment[selectedIndex];

  const nextEquipment = () => {
    setSelectedIndex((currentIndex) => (currentIndex + 1) % equipment.length);
  };

  const previousEquipment = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === 0 ? equipment.length - 1 : currentIndex - 1
    );
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-10 bg-hero-pattern px-2 pb-8 pt-2 md:pt-10">
      <div className="relative mt-4 flex w-full max-w-6xl flex-col overflow-hidden bg-white md:mt-0 md:h-[80%] md:flex-row">
        <motion.h1
          className="absolute left-4 top-0 z-0 text-center text-4xl font-extrabold uppercase text-gray-300/30 md:left-8 md:top-2 md:text-8xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {selectedEquipment.name}
        </motion.h1>

        <div className="relative flex flex-1 items-center justify-center bg-slate-100">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedEquipment.id}
              src={selectedEquipment.imagePath}
              alt={selectedEquipment.name}
              className="h-full w-full rounded-lg object-cover md:w-[500px] md:rounded-none md:rounded-l-lg"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>
        </div>

        <motion.div
          className="z-10 flex w-full flex-col justify-between bg-[#1E2D44] p-4 text-white md:w-[38%] md:p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <h2 className="text-2xl font-bold">{selectedEquipment.name.toUpperCase()}</h2>
            <p className="text-gray-300">
              {selectedEquipment.company.toUpperCase()} - {selectedEquipment.model.toUpperCase()}
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-200">
              {selectedEquipment.description}
            </p>

            <div className="mt-6">
              <ul className="space-y-3">
                {selectedEquipment.characteristics.map((characteristic) => (
                  <li key={characteristic.id} className="flex flex-col text-gray-200">
                    <span>{characteristic.title.toUpperCase()}:</span>
                    <span className="font-semibold text-primaryYellow">
                      {characteristic.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={previousEquipment}
              className="flex w-full items-center justify-center px-4 py-2 text-white transition hover:text-primaryYellow"
            >
              <MdOutlineArrowBackIos size={60} />
            </button>
            <button
              onClick={nextEquipment}
              className="flex w-full items-center justify-center px-4 py-2 text-white transition hover:text-primaryYellow"
            >
              <MdOutlineArrowForwardIos size={60} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl bg-white/40 p-4 text-center shadow-sm">
        <p className="text-base text-gray-700 md:text-lg">
          <span className="font-semibold">Availability notice:</span> Equipment records are now sourced from the admin database and remain subject to availability at the time of request.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block bg-primaryYellow px-6 py-3 font-medium text-[#1E2D44]/80 transition hover:bg-yellow-500"
        >
          Make A Request
        </Link>
      </div>
    </div>
  );
}
