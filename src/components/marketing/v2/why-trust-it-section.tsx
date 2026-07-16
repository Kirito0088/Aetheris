"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Activity, Lock } from "lucide-react";

export function WhyTrustItSection() {
  return (
    <section className="w-full bg-[#FBFBFA] py-32 px-4 md:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="mb-24 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-balance text-4xl font-semibold tracking-tighter text-[#111111] md:text-6xl">
              Engineered for the <br /> uncompromising.
            </h2>
          </div>
          <p className="max-w-md text-lg text-gray-500">
            When 80,000 people are in your care, "good enough" is a failure condition.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <TrustCard 
            icon={<Activity className="h-6 w-6" />}
            metric="99.999%"
            title="Uptime SLA"
            description="Geographically distributed redundancy ensures zero downtime during peak operational loads."
          />
          <TrustCard 
            icon={<Lock className="h-6 w-6" />}
            metric="Zero-Trust"
            title="Architecture"
            description="Every node, user, and sensor is continuously authenticated. No implicit trust boundaries."
          />
          <TrustCard 
            icon={<Shield className="h-6 w-6" />}
            metric="FedRAMP"
            title="High Ready"
            description="Built to the most stringent data security standards required by federal deployments."
          />
        </div>
      </div>
    </section>
  );
}

function TrustCard({ icon, metric, title, description }: { icon: React.ReactNode, metric: string, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-between rounded-[2rem] border border-black/5 bg-white p-8 md:p-12 shadow-sm"
    >
      <div className="mb-16 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-[#111111] border border-black/5">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 text-4xl font-semibold tracking-tighter text-[#111111] md:text-5xl">{metric}</h3>
        <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-gray-500">{title}</span>
        <p className="text-gray-500 leading-relaxed text-lg">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
