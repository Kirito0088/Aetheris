"use client";

import React from "react";
import { motion } from "framer-motion";
import { Maximize, Navigation2, Star } from "lucide-react";

export function ShowMeSection() {
  return (
    <section className="w-full bg-[#FBFBFA] py-32 px-4 md:py-48">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        
        <div className="mb-24 text-center max-w-3xl">
          <h2 className="text-balance text-4xl font-semibold tracking-tighter text-[#111111] md:text-5xl lg:text-7xl">
            Comprehensive Venue Control
          </h2>
          <p className="mt-6 text-balance text-lg text-gray-500 md:text-xl">
            Every operational vector synthesized into a single, elegant interface.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
          
          {/* Large Card: Live Density Mapping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-black/5 bg-white p-8 md:col-span-2 md:row-span-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative z-10 max-w-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                <Maximize className="h-5 w-5" />
              </div>
              <h3 className="text-3xl font-semibold text-[#111111]">Live Density Mapping</h3>
              <p className="mt-4 text-lg text-gray-500">
                Heatmaps updated in milliseconds. See exactly where your crowd is massing before it becomes a problem.
              </p>
            </div>
            {/* Abstract UI representation */}
            <div className="absolute -bottom-10 -right-10 h-[300px] w-[400px] rounded-tl-[3rem] border border-black/5 bg-gray-50/80 shadow-2xl transition-transform duration-700 group-hover:-translate-y-4 group-hover:-translate-x-4">
               <div className="p-8 flex flex-col gap-4">
                 <div className="h-4 w-1/3 rounded-full bg-gray-200" />
                 <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-red-100 to-blue-50" />
                 <div className="flex gap-2">
                   <div className="h-8 w-8 rounded-full bg-red-200" />
                   <div className="h-8 w-8 rounded-full bg-yellow-200" />
                   <div className="h-8 w-8 rounded-full bg-green-200" />
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Small Card: Security Dispatch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="group flex flex-col justify-between rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Navigation2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#111111]">Security Dispatch</h3>
              <p className="mt-2 text-gray-500">
                Route personnel via the fastest clear paths.
              </p>
            </div>
          </motion.div>

          {/* Small Card: VIP Movement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="group flex flex-col justify-between rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Star className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#111111]">VIP Movement</h3>
              <p className="mt-2 text-gray-500">
                Secure tracking for high-profile individuals.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
