"use client";

import React from 'react';
import Image from 'next/image';
import { MdOutlineArrowForwardIos } from "react-icons/md";

import heroImg from "../../public/payloader.jpg";

export default function Hero() {
  return (
    <div className='relative flex flex-col md:flex-row gap-10 justify-between md:h-[380px] bg-background font-montserrat pt-4 pb-12 md:pb-0'>
      <div className="relative md:w-1/2 h-[300px] md:h-[420px] md:mt-8">
        <Image 
          className="object-cover w-full h-full md:rounded-md" 
          src={heroImg} 
          alt="devices" 
          priority
        />
      </div>

      <div className='flex flex-col md:ml-8 cursor-default items-center leading-loose justify-center md:items-start md:justify-center text-center md:text-left md:w-1/2 gap-6'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl text-white font-normal'>
          Speed. Efficiency <br/> Safety.
        </h1>
        <h2 className='text-lg md:text-xl text-gray-300'>
          Walhez Group gets the job done.
        </h2>
        <button className='flex items-center gap-2 -ml-2 mt-4 transition-all text-base md:text-lg font-normal 
        p-2 rounded-md bg-primaryYellow md:bg-transparent md:text-white hover:text-primaryYellow hover:underline'
         >
          <MdOutlineArrowForwardIos className=' text-base md:text-4xl font-bold md:text-primaryYellow'/>
          Discover our services
        </button>
      </div>
      <div className='absolute right-0 bottom-[-18px] md:bottom-[-28px] w-[100px] md:w-[150px] h-6 md:h-8 bg-primaryRed drop-shadow-lg shadow-lg'
        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
      </div>
    </div>
  );
}
