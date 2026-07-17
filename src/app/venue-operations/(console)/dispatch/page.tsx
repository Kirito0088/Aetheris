"use client";

import React, { useState } from "react";
import { Users, Star, MapPin, Languages, Compass, Radio, Battery, MessageSquare, RefreshCw, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING_FAST, MOTION_PRESETS } from "@/features/intelligence/data/motion-config";

interface Volunteer {
  id: string;
  name: string;
  avatar: string;
  languages: string[];
  currentZone: string;
  assignment: string;
  distance: string;
  eta: string;
  battery: number;
  radioChannel: string;
  status: "available" | "busy" | "dispatched";
  workload: "low" | "optimal" | "high";
  lastActive: string;
  aiRecommended: boolean;
  recReason?: string;
}

const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: "VOL-1001",
    name: "Sofia Martinez",
    avatar: "SM",
    languages: ["ES", "EN"],
    currentZone: "North Gate A",
    assignment: "Queue Control",
    distance: "120m",
    eta: "2 mins",
    battery: 88,
    radioChannel: "Ch 4 (Ops)",
    status: "available",
    workload: "optimal",
    lastActive: "3m ago",
    aiRecommended: true,
    recReason: "Language match & proximity to North gate bottleneck.",
  },
  {
    id: "VOL-1002",
    name: "Mateo Ricci",
    avatar: "MR",
    languages: ["IT", "EN", "ES"],
    currentZone: "East Concourse",
    assignment: "Info Desk 2",
    distance: "340m",
    eta: "5 mins",
    battery: 92,
    radioChannel: "Ch 2 (Info)",
    status: "busy",
    workload: "high",
    lastActive: "1m ago",
    aiRecommended: false,
  },
  {
    id: "VOL-1003",
    name: "Elena Geller",
    avatar: "EG",
    languages: ["DE", "EN"],
    currentZone: "West Concourse",
    assignment: "Ticket Assistance",
    distance: "210m",
    eta: "3 mins",
    battery: 74,
    radioChannel: "Ch 4 (Ops)",
    status: "available",
    workload: "low",
    lastActive: "8m ago",
    aiRecommended: true,
    recReason: "Low current workload; optimal placement for Sector 120 support.",
  },
  {
    id: "VOL-1004",
    name: "Yuki Tanaka",
    avatar: "YT",
    languages: ["JA", "EN"],
    currentZone: "VIP Entrance B",
    assignment: "VIP Greeter",
    distance: "400m",
    eta: "7 mins",
    battery: 96,
    radioChannel: "Ch 1 (VIP)",
    status: "dispatched",
    workload: "optimal",
    lastActive: "Just now",
    aiRecommended: false,
  },
  {
    id: "VOL-1005",
    name: "Marcus Aurelius",
    avatar: "MA",
    languages: ["FR", "EN", "AR"],
    currentZone: "South Gate T-4",
    assignment: "Directional Guide",
    distance: "150m",
    eta: "2 mins",
    battery: 65,
    radioChannel: "Ch 3 (South)",
    status: "available",
    workload: "optimal",
    lastActive: "5m ago",
    aiRecommended: false,
  },
];

export default function DispatchPage() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [messageText, setMessageText] = useState<{ [key: string]: string }>({});
  const [sentMessage, setSentMessage] = useState<{ [key: string]: boolean }>({});

  const handleSendMessage = (id: string) => {
    if (!messageText[id]?.trim()) return;
    setSentMessage(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSentMessage(prev => ({ ...prev, [id]: false }));
      setMessageText(prev => ({ ...prev, [id]: "" }));
    }, 2000);
  };

  const filteredVolunteers = MOCK_VOLUNTEERS.filter(v => {
    if (filterStatus === "all") return true;
    if (filterStatus === "recommended") return v.aiRecommended;
    return v.status === filterStatus;
  });

  return (
    <motion.div {...MOTION_PRESETS.pageTransition} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-6 h-6 text-[var(--brand-blue)]" /> Volunteer Dispatch Center
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">Real-time volunteer status tracking, AI dispatch suggestions and routing</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border
              ${filterStatus === "all" ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]" : "bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"}
            `}
          >
            All
          </button>
          <button 
            onClick={() => setFilterStatus("recommended")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border flex items-center gap-1
              ${filterStatus === "recommended" ? "bg-amber-500 text-white border-amber-500" : "bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"}
            `}
          >
            <Star className="w-3.5 h-3.5 fill-current" /> AI Recs
          </button>
          <button 
            onClick={() => setFilterStatus("available")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border
              ${filterStatus === "available" ? "bg-emerald-500 text-white border-emerald-500" : "bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"}
            `}
          >
            Available
          </button>
        </div>
      </div>

      {/* Grid Layout of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVolunteers.map((vol) => {
            const isSelected = selectedVolunteer === vol.id;
            const statusColors = {
              available: "bg-emerald-500 text-white border-emerald-500/20",
              busy: "bg-amber-500 text-white border-amber-500/20",
              dispatched: "bg-blue-500 text-white border-blue-500/20",
            };

            const workloadColors = {
              low: "text-blue-500 bg-blue-500/10",
              optimal: "text-emerald-500 bg-emerald-500/10",
              high: "text-red-500 bg-red-500/10",
            };

            return (
              <motion.div
                key={vol.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={SPRING_FAST}
                className={`bg-[var(--surface-elevated)] border rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group
                  ${isSelected ? "border-[var(--brand-blue)] ring-2 ring-[var(--brand-blue)]/20" : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"}
                `}
                onClick={() => setSelectedVolunteer(isSelected ? null : vol.id)}
              >
                {/* Background glow for AI recommended */}
                {vol.aiRecommended && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none rounded-tr-2xl" />
                )}

                {/* Card Top: Avatar & Meta */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 flex items-center justify-center font-bold text-sm text-[var(--brand-blue)]">
                        {vol.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">
                          {vol.name}
                        </h3>
                        <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">
                          {vol.id}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${statusColors[vol.status]}`}>
                      {vol.status}
                    </span>
                  </div>

                  {/* AI Recommendation Alert */}
                  {vol.aiRecommended && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-xs text-amber-700 flex items-start gap-1.5">
                      <Star className="w-4 h-4 shrink-0 fill-current mt-0.5" />
                      <div>
                        <p className="font-bold">AI Suggestion</p>
                        <p className="text-[11px] opacity-90 mt-0.5">{vol.recReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-[var(--border-subtle)] pt-3">
                    <div className="space-y-1">
                      <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Current Zone
                      </span>
                      <p className="font-semibold text-[var(--text-primary)]">{vol.currentZone}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" /> Active Task
                      </span>
                      <p className="font-semibold text-[var(--text-primary)]">{vol.assignment}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5" /> Languages
                      </span>
                      <p className="font-semibold text-[var(--text-primary)]">{vol.languages.join(", ")}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[var(--text-tertiary)] font-medium">Workload</span>
                      <div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold capitalize ${workloadColors[vol.workload]}`}>
                          {vol.workload}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Device Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] bg-[var(--surface-base)] p-2 rounded-lg border border-[var(--border-subtle)]">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-blue-500" /> {vol.radioChannel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Battery className={`w-3.5 h-3.5 ${vol.battery > 30 ? "text-emerald-500" : "text-red-500"}`} /> {vol.battery}%
                    </span>
                    <span>Act: {vol.lastActive}</span>
                  </div>
                </div>

                {/* Expandable Action Panel */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={SPRING_FAST}
                      className="overflow-hidden pt-4 border-t border-[var(--border-subtle)] mt-4 space-y-3 cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Quick Message..."
                          value={messageText[vol.id] || ""}
                          onChange={(e) => setMessageText(prev => ({ ...prev, [vol.id]: e.target.value }))}
                          className="flex-1 px-3 py-1.5 bg-[var(--surface-base)] border border-[var(--border-subtle)] rounded-lg text-xs outline-none focus:border-[var(--brand-blue)] transition-colors"
                        />
                        <button
                          onClick={() => handleSendMessage(vol.id)}
                          className="p-1.5 bg-[var(--brand-blue)] text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          {sentMessage[vol.id] ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 bg-[var(--surface-base)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-lg text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5" /> Reassign
                        </button>
                        <button className="flex-1 py-1.5 bg-[var(--brand-blue)] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> Operations Chat
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
