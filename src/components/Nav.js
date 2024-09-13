"use client";

import React, { useState } from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkVariants = {
    hover: {scale: 1.03},
    tap: { scale: 0.9 },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = ["ABOUT US", "PROJECTS", "SERVICES", "EQUIPMENT"];


  return (
    <div className='flex justify-between items-center p-4 bg-[#1E2D44] text-white font-montserrat font-thin'>
      <div>
        Walhez Co
      </div>

      {/* Desktop Menu */}
      <div className='hidden sm:flex tracking-widest text-base font-thin'>
        <ul className='flex gap-10 text-base'>
        {['ABOUT US', 'PROJECTS', 'SERVICES', 'EQUIPMENT'].map((item, index) => (
          <motion.li
            key={index}
            variants={linkVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link href={`/${item.toLowerCase().replace(' ', '-')}`}
            className="hover:underline hover:underline-offset-8 hover:decoration-yellow-400 hover:text-yellow-400 transition-all">
              {item}
            </Link>
          </motion.li>
        ))}
        </ul>
      </div>

      {/* Hamburger Menu Button */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    
      {/* Mobile Menu 
      {isMobileMenuOpen && (
      <div className="absolute top-18 left-0 w-full z-100 bg-[#1E2D44] sm:hidden">
        <ul className="flex flex-col items-center gap-4 p-4">
          {navItems.map((item, index) => (
            <motion.li
              key={index}
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={`/${item.toLowerCase().replace(" ", "-")}`}
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
      </div>
      )}
      */}

      <div className='items-center hidden md:flex'>
        <button className='bg-[#F2C94C] px-4 py-1 text-[#1E2D44] font-normal rounded-md'>CONTACT US</button>
      </div>
    </div>
  )
}
