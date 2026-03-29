"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MdOutlineArrowForwardIos } from "react-icons/md";


import { team } from "@/utils/data";
import Image from "next/image";
import Link from 'next/link';

export default function Page() {
  const fadeInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const springUpVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: visionRef, inView: visionInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: partnerRef, inView: partnerInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="pt-6 md:pt-12 pb-20 px-12 md:px-16 flex flex-col gap-16 bg-hero-pattern">
      
      {/* About Section */}
      <div ref={aboutRef} className="mt-6 flex flex-col md:flex-row items-start justify-between">
        <div className="flex flex-col gap-8 max-w-full md:max-w-[50%]">
          <motion.h1 
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            className="text-2xl md:text-3xl lg:text-4xl text-center md:text-left font-bold text-[#1E2D44]"
          >
            We have excellence at our core!
          </motion.h1>

          <div className="flex flex-col gap-10">
            <motion.p
              variants={fadeInVariants}
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
              className="text-base md:text-lg text-gray-700 leading-relaxed"
            >
              At Walhez Group, we specialize in providing high-quality equipment leasing solutions tailored to meet the diverse needs 
              of the construction and excavation industries. With a strong focus on reliability and performance, our fleet 
              includes state-of-the-art dredgers, swamp buggies, trucks, bulldozers, and payloaders.
            </motion.p>
            {/* Image only on mobile */}
            <div className="w-full flex justify-center md:hidden relative">
              <div className="relative border-yellow-500 p-6">
                <Image src='/worker1.jpg' alt='Construction worker' width={250} height={150} className="rounded-md" />
                <div className="absolute top-0 left-0 h-1/2 w-2 border-l-8 border-yellow-500"></div>
                <div className="absolute bottom-0 right-0 h-1/2 w-2 border-r-8 border-yellow-500"></div>
              </div>
            </div>

            <motion.p
              variants={fadeInVariants}
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
              className="text-base md:text-lg text-gray-700 leading-relaxed"
            >
              Our commitment to excellence and customer satisfaction sets us apart in the industry. We understand the 
              critical role that efficient and well-maintained equipment plays in the successful execution of projects. 
              Our team of experienced professionals is dedicated to delivering not only top-tier machinery but also unparalleled 
              service and support, ensuring that your operations run smoothly and effectively.
            </motion.p>
          </div>
        </div>
        {/* Same image for desktop */}
        <div className="hidden md:flex p-8 border-r-8 border-b-8 border-yellow-400">
          <Image src='/worker1.jpg' alt='Construction worker' width={350} height={200} className="mr-10" />
        </div>
      </div>

      {/* Mission, Vision, and Meet the Team */}
      <div className="flex flex-col items-center md:max-w-[70%] gap-16 text-white place-self-center">
        
        {/* Meet Our Team */}
        <motion.div
          ref={missionRef}
          variants={springUpVariants}
          initial="hidden"
          animate={missionInView ? "visible" : "hidden"}
          className="relative p-8 flex flex-col gap-12 items-center w-full justify-center backdrop-blur-sm"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl text-center md:text-left font-bold text-[#1E2D44] underline underline-offset-8">
            Meet Our Team
          </h2>
          <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 justify-items-center">
            {team.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <Image src={member.image} alt={member.name} height={192} width={192} className="object-cover rounded-full" />
                <h3 className="text-base md:text-lg font-medium text-[#1E2D44] mt-2">{member.name}</h3>
                <p className="text-sm text-black italic font-bold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
        
        </motion.div>

        {/* Mission */}
        <motion.div
          ref={missionRef}
          variants={springUpVariants}
          initial="hidden"
          animate={missionInView ? "visible" : "hidden"}
          className="relative p-8 flex flex-col gap-8 items-center bg-[#1E2D44]/90 rounded-md w-full justify-center"
        >
          <span className="absolute text-9xl text-primaryYellow top-2 left-4">“</span>
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-sm md:text-lg text-center font-thin max-w-[80%]">
            At Walhez Group, our mission is to empower businesses in the construction and excavation industries by providing reliable, 
            high-quality services and equipment leasing solutions. We are committed to efficiency, innovation, and customer satisfaction, 
            ensuring that every project has access to the best machinery, from dredgers and swamp buggies to trucks and bulldozers. 
            Through excellence in service and support, we help our partners achieve their goals seamlessly and cost-effectively.
          </p>
          <span className="absolute text-9xl text-primaryYellow -bottom-14 right-4">”</span>
        </motion.div>

        {/* Vision */}
        <motion.div
          ref={visionRef}
          variants={springUpVariants}
          initial="hidden"
          animate={visionInView ? "visible" : "hidden"}
          className="relative p-8 flex flex-col gap-8 items-center bg-[#1E2D44]/90 rounded-md  justify-center"
        >
          <span className="absolute text-9xl text-primaryYellow top-2 left-4">“</span>
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p className="text-sm  md:text-lg  text-center font-thin max-w-[80%]">
            Our vision is to become the leading provider of construction services and equipment leasing solutions in Africa, revolutionizing 
            the industry with cutting-edge technology, exceptional service, and unwavering reliability. We aim to set new standards for efficiency and 
            sustainability, enabling businesses to build the future with confidence. Through strategic partnerships and continuous innovation, 
            Walhez Group envisions a world where every project has the tools it needs to succeed.
          </p>
          <span className="absolute text-9xl text-primaryYellow -bottom-14 right-4">”</span>
        </motion.div>
      </div>

      <motion.h3
        ref={partnerRef}
        variants={fadeInVariants}
        initial="hidden"
        animate={partnerInView ? "visible" : "hidden"}
        className="text-base md:text-lg text-gray-700 leading-relaxed backdrop-blur-sm p-1"
      >
        Partnering with Walhez Group means gaining access to a trusted resource that prioritizes 
        your project&apos;s success. We look forward to the opportunity to support your operations and contribute to your achievements.
      </motion.h3>
      
      <Link href="/contact">
        <motion.button
          ref={partnerRef}
          variants={fadeInVariants}
          initial="hidden"
          animate={partnerInView ? "visible" : "hidden"}
          className="flex items-center gap-2 -mt-8 transition-all text-base md:text-lg font-normal 
            p-2 rounded-md bg-primaryYellow md:bg-transparent hover:text-primaryYellow hover:underline backdrop-blur-sm"
        >
          <MdOutlineArrowForwardIos className='text-base md:text-4xl font-bold hover:text-primaryYellow'/>
          Discover our services
        </motion.button>
      </Link>
    </div>
  );
}
