"use client";

import React from 'react';
import Link from 'next/link';
import { RiFacebookBoxLine, RiTwitterLine, RiInstagramLine } from 'react-icons/ri';

export default function Footer() {
  return (
    <div className="flex flex-col w-full bg-[#1E2D44] text-slate-300 font-montserrat pt-20 p-16 pb-8 gap-10 font-thin">
      <div className="grid grid-cols-2 gap-6 md:flex md:justify-between md:items-start">
        {/* Placeholder for Logo */}
        <div className="w-[200px] h-[200px] md:hidden lg:flex col-span-2 relative -mt-16">
          {/** Await Logo Arts and update here. */}
        </div>

        {/* Sitemap */}
        <div className="flex flex-col gap-2">
          <h2 className="text-base tracking-widest font-medium hover:text-yellow-400">SITEMAP</h2>
          <ul className="text-sm">
            <li><Link href="/" className="hover:text-yellow-400">Services</Link></li>
            <li><Link href="/" className="hover:text-yellow-400">Equipments</Link></li>
            <li><Link href="/" className="hover:text-yellow-400">The Team</Link></li>
          </ul>
        </div>

        {/* Discover */}
        <div className="flex flex-col gap-2">
          <h2 className="text-base tracking-widest font-medium hover:text-yellow-400">DISCOVER</h2>
          <ul className="text-sm">
            <li><Link href="/" className="hover:text-yellow-400">Our Mission</Link></li>
            <li><Link href="/" className="hover:text-yellow-400">Our Story</Link></li>
            <li><Link href="/" className="hover:text-yellow-400">What Next?</Link></li>
          </ul>
        </div>

        {/* Equipment */}
        <div className="flex flex-col gap-2">
          <h2 className="text-base tracking-widest font-medium hover:text-yellow-400">EQUIPMENT</h2>
          <ul className="text-sm">
            <li><Link href="/" className="hover:text-yellow-400">Gallery</Link></li>
            <li><Link href="/" className="hover:text-yellow-400">FAQ</Link></li>
            <li><Link href="/" className="hover:text-yellow-400">Get Started</Link></li>
          </ul>
        </div>

        {/* Connect (Social Media Links) */}
        <div className="flex flex-col gap-2">
          <h2 className="text-base tracking-widest font-medium hover:text-yellow-400">CONNECT</h2>
          <div className="flex items-center gap-6">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <RiFacebookBoxLine size={25} className="hover:text-yellow-400 transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <RiInstagramLine size={25} className="hover:text-yellow-400 transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <RiTwitterLine size={25} className="hover:text-yellow-400 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Company Description */}
      <div className="text-sm font-thin hidden md:flex md:flex-col gap-4">
        <p>
          We are a team of diverse engineering experts who deal with heavy machinery. 
          With years of experience and a fleet of top-of-the-line equipment, we offer reliable dredging and sand excavation services. 
          Our rental options provide flexibility and cost-effectiveness for both short-term and long-term projects.
        </p>
        <p>Walhez Group</p>
      </div>

      {/* Copyright */}
      <div className="flex items-center text-xs justify-center">
        <p>© Copyright 2024, Walhez</p>
      </div>
    </div>
  );
}
