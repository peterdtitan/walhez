"use client";

import React from 'react'
import Link from 'next/link';
import {RiFacebookBoxLine, RiTwitterLine, RiInstagramLine} from 'react-icons/ri'


export default function Footer() {
  return (
    <div className='flex flex-col w-full bg-[#1E2D44] text-slate-300 font-montserrat pt-20 p-16 pb-8 gap-10 font-thin'>
        <div className='grid grid-cols-2 gap-6 md:flex-row md:flex justify-between items-start'>
            <div className='w-[200px] h-[200px] md:hidden lg:flex col-span-2 relative -mt-16'>
               {/** Await Logo Arts and update here. */} 
            </div>

            <div className="flex flex-col gap-2 cursor-pointer">
                <h2 className="text-base tracking-widest font-medium hover:text-primaryYellow">SITEMAP</h2>
                <div className="text-sm">
                    <ul>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">Services</li></Link>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">Equipments</li></Link>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">The Team</li></Link>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-2 cursor-pointer">
                <h2 className="text-base tracking-widest font-medium hover:text-primaryYellow">DISCOVER</h2>
                <div className="text-sm">
                    <ul>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">Our Mission</li></Link>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">Our Story</li></Link>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">What Next?</li></Link>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-2 cursor-pointer">
                <h2 className="text-base tracking-widest font-medium hover:text-primaryYellow">EQUIPMENT</h2>
                <div className="text-sm">
                    <ul>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">Gallery</li></Link>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">FAQ</li></Link>
                        <Link href="/" legacyBehavior><li className="hover:text-primaryYellow">Get Started</li></Link>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-2 cursor-pointer">
                <h2 className="text-base tracking-widest font-medium hover:text-primaryYellow">CONNECT</h2>
               
               <div className="flex items-center justify-start gap-6">
                    <Link href="" legacyBehavior>
                        <a rel="noopener noreferrer" target="_blank"><RiFacebookBoxLine size={25}/></a>
                    </Link>
                    <Link href="" legacyBehavior>
                        <a rel="noopener noreferrer" target="_blank"><RiInstagramLine size={25} /></a>
                    </Link>
                    <Link href=""  legacyBehavior>
                        <a rel="noopener noreferrer" target="_blank"><RiTwitterLine size={25} /></a>
                    </Link>
               </div>
            </div>
        </div>

        <div className="text-sm font-thin hidden md:flex md:flex-col gap-4">
            <p>We are a team of diverse engineering experts who deal heavy machinery. 
            With years of experience and a fleet of top-of-the-line equipment, we offer reliable dredging and sand excavation services. 
            Our rental options provide flexibility and cost-effectiveness for both short-term and long-term projects.
            </p>
            <p>Walhez Group</p>
        </div>

        <div className="flex items-center text-xs justify-center">
            <p>© Copyright 2024, Walhez</p>
        </div>
    </div>
  )
}