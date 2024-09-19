import React from 'react'
import Image from 'next/image';

import heroImg from "../../public/payloader.jpg";

import { 
    MdOutlineArrowForwardIos, 
    MdOutlineRealEstateAgent ,
    MdOutlineCarRental,
    MdOtherHouses,
    MdOutlinePointOfSale,
    MdEditCalendar
} from "react-icons/md";

import { LuConstruction } from "react-icons/lu";
import { CiDeliveryTruck, CiBoxes } from "react-icons/ci";
import { GiCargoCrane } from "react-icons/gi";

export default function Projects() {
  return (
    <div className='mx-[10%] flex flex-col md:flex-row items-center md:items-start md:gap-20 lg:gap-36 pb-10 h-auto'>
        <div className='bg-background h-[400px] md:h-[550px] w-[300px] md:w-[400px] -mt-12 p-10 gap-4 flex flex-col'>
            <h1 className='text-3xl md:text-4xl lg:text-4xl text-white font-normal leading-normal md:leading-loose'>
                We work with clients on a broad range of projects.
             </h1>
             <button className='flex items-center gap-2 -ml-2 mt-4 transition-all text-base md:text-lg font-normal 
                p-2 rounded-md bg-primaryYellow md:bg-transparent md:text-white hover:text-primaryYellow hover:underline'
            >
                <MdOutlineArrowForwardIos className=' text-base md:text-4xl font-bold md:text-primaryYellow'/>
                Get in Touch
            </button>
        </div>
        <div className='mt-16 grid grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 md:gap-x-32'>  
            <div className='flex flex-col gap-4 items-center justify-center'>
                <LuConstruction className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Construction</h4>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <CiDeliveryTruck className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Supply</h4>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <MdOutlineRealEstateAgent className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Real Estate</h4>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <MdOutlineCarRental className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Rental</h4>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <MdOtherHouses className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Leasing</h4>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <GiCargoCrane className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Dredging</h4>
            </div>
            <div className='hidden lg:flex flex-col gap-4 items-center justify-center'>
                <MdOutlinePointOfSale className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Sales</h4>
            </div>
            <div className='hidden lg:flex flex-col gap-4 items-center justify-center'>
                <MdEditCalendar className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Planning</h4>
            </div>
            <div className='hidden lg:flex flex-col gap-4 items-center justify-center'>
                <CiBoxes className='text-primaryYellow text-4xl lg:text-6xl font-semibold'/>
                <h4>Logistics</h4>
            </div>
        </div>
    
    </div>
  )
}
