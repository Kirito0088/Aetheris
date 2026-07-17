"use client";

import React, { useState } from "react";
import { Clock, MapPin, User, ShieldAlert, BrainCircuit, Filter, Plus, Activity, Check } from "lucide-react";
import { AIRecommendation } from "@/features/intelligence/components/AIRecommendation";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING_FAST, MOTION_PRESETS } from "@/features/intelligence/data/motion-config";

// Types
type IncidentSeverity = 'critical' | 'high' | 'moderate' | 'low';
type IncidentStatus = 'active' | 'resolved' | 'investigating' | 'predicted';
type IncidentCategory = 'medical' | 'security' | 'infrastructure' | 'weather';

interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  status: IncidentStatus;
  zone: string;
  confidence?: number;
  assignment?: string;
  eta?: string;
  action: string;
  reasoning: string;
  time: string;
}

// Mock Data
const ACTIVE_INCIDENTS: Incident[] = [
  {
    id: "INC-2041",
    title: "Medical Emergency: Suspected Dehydration",
    severity: "high",
    category: "medical",
    status: "active",
    zone: "Sector 114, Row H",
    assignment: "Med-Team Alpha",
    eta: "2 mins",
    action: "Dispatch nearest EMT unit with hydration kit.",
    reasoning: "Heart rate monitor from fan wearable indicates severe spike. Temperature in Sector 114 is elevated.",
    time: "14:32"
  },
  {
    id: "INC-2042",
    title: "Unauthorized Access Attempt",
    severity: "moderate",
    category: "security",
    status: "investigating",
    zone: "VIP Entrance B",
    assignment: "Security Unit 4",
    eta: "On Scene",
    action: "Verify credentials manually. Detain if necessary.",
    reasoning: "Facial recognition mismatch with ticketing database.",
    time: "14:40"
  }
];

const PREDICTED_RISKS: Incident[] = [
  {
    id: "PRD-992",
    title: "Post-Match Bottleneck",
    severity: "high",
    category: "infrastructure",
    status: "predicted",
    zone: "North Concourse Exit",
    confidence: 94,
    action: "Open overflow gates N1 and N2 at 85th minute.",
    reasoning: "Historical data shows 40% of crowd exits via North Concourse. Current occupancy exceeds safe egress limits by 12%.",
    time: "Predicted: 15:45"
  }
];

const RESOLVED_INCIDENTS: Incident[] = [
  {
    id: "INC-2038",
    title: "Turnstile Failure",
    severity: "moderate",
    category: "infrastructure",
    status: "resolved",
    zone: "South Gate, T-4",
    action: "Technician reset local breaker.",
    reasoning: "Power surge detected. Fail-safe engaged.",
    time: "Resolved at 13:15"
  }
];

export default function IncidentsDashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'predicted' | 'resolved'>('active');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const renderSeverityBadge = (severity: IncidentSeverity) => {
    const styles = {
      critical: "bg-red-500/10 text-red-600 border-red-500/20",
      high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      moderate: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      low: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[severity]}`}>
        {severity}
      </span>
    );
  };

  const renderIncidentCard = (incident: Incident) => {
    const isSelected = selectedIncident === incident.id;
    return (
      <motion.div
        key={incident.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        onClick={() => setSelectedIncident(isSelected ? null : incident.id)}
        className={`bg-[var(--surface-elevated)] border rounded-xl p-5 transition-all cursor-pointer shadow-sm flex flex-col gap-4
          ${isSelected ? "border-[var(--brand-blue)] ring-2 ring-[var(--brand-blue)]/10" : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"}
        `}
      >
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Left Col: Core Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              {renderSeverityBadge(incident.severity)}
              <span className="text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider">{incident.id}</span>
              <span className="text-[var(--text-tertiary)] text-xs">•</span>
              <span className="text-[var(--text-tertiary)] text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {incident.time}
              </span>
            </div>
            
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{incident.title}</h3>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                  <MapPin className="w-4 h-4 text-[var(--brand-emerald)]" />
                  {incident.zone}
                </div>
                {incident.assignment && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                    <User className="w-4 h-4 text-[var(--brand-blue)]" />
                    {incident.assignment}
                  </div>
                )}
                {incident.eta && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                    <Activity className="w-4 h-4 text-orange-500" />
                    ETA: {incident.eta}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: AI & Actions */}
          <div className="flex-1 lg:max-w-md bg-[var(--surface-base)] rounded-lg p-4 border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-start gap-2">
              <BrainCircuit className="w-4 h-4 text-[var(--brand-blue)] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--text-primary)]">AI Reasoning</p>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{incident.reasoning}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <ShieldAlert className="w-4 h-4 text-[var(--brand-emerald)] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--text-primary)]">Recommended Action</p>
                <p className="text-xs font-medium text-[var(--text-primary)]">{incident.action}</p>
              </div>
            </div>
            
            {incident.confidence && (
              <div className="mt-2 flex items-center justify-between bg-[var(--surface-sunken)] p-2 rounded-md">
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">Prediction Confidence</span>
                <span className="text-[11px] font-bold text-[var(--brand-blue)]">{incident.confidence}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Action Controls */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SPRING_FAST}
              className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap gap-3"
            >
              <button className="px-4 py-2 bg-[var(--brand-blue)] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm">
                <Check className="w-3.5 h-3.5" /> Resolve Incident
              </button>
              <button className="px-4 py-2 bg-[var(--surface-base)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-semibold rounded-lg hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Reassign Unit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div {...MOTION_PRESETS.pageTransition} className="space-y-8">
      {/* Hero Summary */}
      <section className="bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface-base)] rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Current Match</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">Mexico vs Argentina</p>
            <p className="text-xs font-semibold text-[var(--brand-emerald)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 43' First Half
            </p>
          </div>
          <div className="space-y-2 md:pl-6 pt-4 md:pt-0">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">AI Risk Level</p>
            <p className="text-lg font-bold text-orange-500">Moderate</p>
            <p className="text-xs text-[var(--text-tertiary)]">Based on crowd flow & weather</p>
          </div>
          <div className="space-y-2 md:pl-6 pt-4 md:pt-0">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Active Incidents</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">3</p>
            <p className="text-xs text-[var(--text-tertiary)]">1 High, 2 Moderate</p>
          </div>
          <div className="space-y-2 md:pl-6 pt-4 md:pt-0 flex flex-col justify-center">
            <button className="w-full py-2.5 bg-[var(--brand-blue)] text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm text-xs">
              <Plus className="w-4 h-4" /> Log Incident
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div className="flex space-x-6">
              {(['active', 'predicted', 'resolved'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 -mb-4 text-xs font-semibold capitalize transition-all border-b-2 tracking-wide
                    ${activeTab === tab 
                      ? "border-[var(--brand-blue)] text-[var(--text-primary)]" 
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                >
                  {tab} Incidents
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)] px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)]">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>

          {/* Incident List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {activeTab === 'active' && ACTIVE_INCIDENTS.map(renderIncidentCard)}
              {activeTab === 'predicted' && PREDICTED_RISKS.map(renderIncidentCard)}
              {activeTab === 'resolved' && RESOLVED_INCIDENTS.map(renderIncidentCard)}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: AI Recs & Timeline */}
        <div className="w-full lg:w-80 space-y-6">
          <section className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[var(--brand-blue)]" />
              Priority AI Actions
            </h3>
            <div className="space-y-4">
              <AIRecommendation
                title="Congestion Predicted"
                description="Gate C is experiencing a 15% higher influx than predicted."
                actionLabel="Dispatch Volunteers"
                type="dispatch"
              />
            </div>
          </section>

          <section className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              Recent Timeline
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-strong)] before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-[var(--brand-blue)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-[var(--surface-base)] border border-[var(--border-subtle)] p-3 rounded shadow-sm">
                  <div className="text-xs font-bold text-[var(--text-primary)] mb-1">14:40</div>
                  <div className="text-xs font-medium text-[var(--text-secondary)]">VIP Access Attempt logged</div>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-[var(--border-subtle)] bg-[var(--surface-sunken)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-[var(--surface-base)] border border-[var(--border-subtle)] p-3 rounded shadow-sm">
                  <div className="text-xs font-bold text-[var(--text-primary)] mb-1">14:32</div>
                  <div className="text-xs font-medium text-[var(--text-secondary)]">Medical Emergency Sector 114</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
