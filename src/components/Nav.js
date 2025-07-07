"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about" },
    { name: "PROJECTS", path: "/projects" },
    { name: "EQUIPMENT", path: "/equipment" },
  ];

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
      setIsNavbarVisible(currentScrollY <= lastScrollY || currentScrollY <= 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isNavbarVisible || isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full bg-[#1E2D44] text-white font-thin px-6 py-2 flex justify-between items-center z-50 shadow-md"
      >
        <Link href="/" className="text-lg">
          <div className="flex gap-2 items-center">
            <Image
              src='/logo.png'
              alt="Walhez Co Logo"
              width={80}
              height={80}
            />
            <p>WALHEZ</p>
          </div>
        </Link>

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
                  href={item.path}
                  className="hover:underline hover:underline-offset-8 hover:decoration-yellow-400 hover:text-yellow-400 transition-all"
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Button */}
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

        {/* Contact Button (Desktop) */}
        <div className="items-center hidden md:flex">
          <Link href="/contact">
            <button className="bg-primaryYellow px-4 py-1 text-[#1E2D44] font-normal rounded-md">
              CONTACT US
            </button>
          </Link>
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
            className="fixed top-[70px] left-0 w-full bg-[#1E2D44] sm:hidden z-40 shadow-md"
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
                    href={item.path}
                    className="block text-white hover:text-yellow-400 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
              <Link href="/contact">
                <button className="bg-[#F2C94C] px-4 py-2 text-[#1E2D44] font-normal rounded-md">
                  CONTACT US
                </button>
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
