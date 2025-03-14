"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const navItems = ["ABOUT US", "PROJECTS", "SERVICES", "EQUIPMENT"];

  const linkVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.9 },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isNavbarVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full bg-[#1E2D44] text-white font-thin p-6 flex justify-between items-center z-50 shadow-md"
      >
        <Link href='/' className="text-lg font-semibold">Walhez Co</Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex tracking-widest text-base font-thin">
          <ul className="flex gap-10 text-base">
            {navItems.map((item, index) => (
              <motion.li
                key={index}
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={`/${item === "ABOUT US" ? "about" : item.toLowerCase()}`}
                  className="hover:underline hover:underline-offset-8 hover:decoration-yellow-400 hover:text-yellow-400 transition-all"
                >
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        <div className="items-center hidden md:flex">
          <button className="bg-primaryYellow px-4 py-1 text-background font-normal rounded-md">
            CONTACT US
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[70px] left-0 w-full bg-[#1E2D44] sm:hidden z-40 shadow-md"
          >
            <ul className="flex flex-col items-center gap-4 p-6">
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                  href={`/${item === "ABOUT US" ? "about" : item.toLowerCase()}`}
                    className="block text-white hover:text-yellow-400 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
              <button className="bg-[#F2C94C] px-4 py-2 text-[#1E2D44] font-normal rounded-md">
                CONTACT US
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
