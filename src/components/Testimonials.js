import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdOutlineArrowForwardIos } from "react-icons/md";

import img1 from "../../public/d6h.png";

export default function Testimonials() {
  return (
    <div>
        <div className='flex flex-col gap-8 md:flex-row text-background justify-between mx-6 md:mx-20 bg-primaryGrey py-16 px-10 lg:px-20'>
            <div className='flex flex-col gap-4'>
                <h2 className="max-w-[100%]  text-xl md:text-2xl lg:text-4xl">
                    From small jobs to massive moves, we are here
                </h2>
                <p className="text-xs text-black md:text-base font-thin">
                    We are a nimble team of specialists ready for just about anything.
                </p>
                <Link href='/contact'>
                    <button className='flex items-center gap-2 -ml-1 md:-ml-5 transition-all text-xs md:text-lg font-normal 
                        p-2 rounded-md bg-primaryYellow md:bg-transparent md:text-black hover:text-primaryYellow hover:underline'
                    >
                        <MdOutlineArrowForwardIos className='text-base md:text-4xl font-bold md:text-primaryYellow'/>
                        Find the right service
                    </button>
                </Link>

            </div>
            <div className="relative md:w-[50%] md:h-[450px]">
                    <Image 
                      className="object-cover w-full h-full" 
                      src={img1} 
                      alt="devices" 
                      priority
                    />
            </div>
        </div>
        <div>
        </div>
    </div>
  )
}
