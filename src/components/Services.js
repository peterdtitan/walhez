import React from 'react'
import Image from 'next/image';

import { MdArrowRightAlt, MdForklift } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";

import heroImg from "../../public/payloader.jpg";

export default function Services() {
  return (
    <div className=''>
        <div className='bg-hero-pattern pb-12 bg-cover cursor-default'>
            <div className='flex flex-col justify-center items-center text-center gap-4'>
                <h3 className='mt-20 md:mt-36 max-w-[70%] md:max-w-[50%] leading-loose text-base md:text-md'>
                    The Walhez Group is a team of construction, heavy-machine renting, <br/> and contracting professionals 
                    dedicated to creating solution-oriented <br/> services for projects that need a reliable and timely partner.
                </h3>
                <button className="text-primaryRed md:text-lg flex gap-2 items-center underline underline-offset-4">
                    Get to know us
                    <MdArrowRightAlt />
                </button>
            </div>
            <div className='flex flex-col mx-8 md:mx-20 mt-14 md:mt-10 font-normal'>
                <div className='bg-slate-300/80 flex items-center text-base md:text-3xl px-4 py-6 md:px-6 md:py-10 w-[200px] md:w-[400px] -mb-10 md:-mb-12 -ml-2 z-10'
                style={{ clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 0% 100%)' }}>
                    <h1 className='-mt-[10px] md:-mt-6 font-light text-background'>
                        Our Capabilities
                    </h1>
                </div>
                <div className='mt-6 flex flex-col md:flex-row gap-2 z-20'>
                    <div className='md:w-[50%] h-[200px] md:h-[410px]'>
                        <Image 
                            className="object-cover w-full h-full" 
                            src={heroImg} 
                            alt="devices" 
                            priority
                        />
                    </div>

                    <div className='md:w-1/2 flex flex-col gap-2'>
                        <div className='md:w-full h-[200px]'>
                            <Image 
                                className="object-cover w-full h-full" 
                                src={heroImg} 
                                alt="devices" 
                                priority
                            />
                        </div>
                        <div className='md:w-full h-[200px]'>
                            <Image 
                                className="object-cover w-full h-full" 
                                src={heroImg} 
                                alt="devices" 
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div className='mt-2 py-10 pb-44 bg-primaryGrey mx-8 md:mx-20 flex flex-col items-center gap-6 md:gap-16'>
            <h2 className='font-normal text-center italic text-md md:text-2xl'>
                 Currently servicing up to 10 cities
            </h2>
            <div className='flex flex-col justify-between mx-4 md:mx-0 gap-10 md:flex-row md:max-w-[80%]'>
                <div className='flex gap-4 items-start'>
                    <AiOutlineGlobal className='text-primaryYellow text-6xl md:text-7xl -mt-4'/>
                    <div className='flex flex-col gap-[2px] md:gap-[7px]'>
                        <h3 className='text-lg md:text-2xl lg:text-3xl'>Best Service Reach</h3>
                        <p className='text-xs font-thin italic md:text-md lg:text-base'>
                            We are present across in over 10 locations 
                            and pride ourselves in having good coverage.
                        </p>
                        <button className="text-primaryRed text-sm md:text-base lg:text-lg mt-6 flex gap-2 items-center underline underline-offset-4">
                            See our services
                            <MdArrowRightAlt />
                        </button>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <MdForklift className='text-primaryYellow text-6xl md:text-7xl -mt-4'/>
                    <div className='flex flex-col gap-[2px] md:gap-[7px]'>
                        <h3 className='text-lg md:text-2xl lg:text-3xl'>Top Class Equipment</h3>
                        <p className='text-xs font-thin italic md:text-md lg:text-base'>
                            Whatever the heavy-duty equipment is, we will get it to you.
                            View our available equipment and get in touch today.
                        </p>
                        <button className="text-primaryRed text-sm md:text-base lg:text-lg mt-6 flex gap-2 items-center underline underline-offset-4">
                            Contact us for a quote
                            <MdArrowRightAlt />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}
