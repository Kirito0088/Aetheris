"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { CheckCircle, MapPin, Navigation, Plus, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { IncidentDrawer } from "@/components/ui/IncidentDrawer";
import { useRealtimeZones } from "@/hooks";
import { createClient } from "@/lib/supabase/client";

export default function VolunteerPage() {
  const { tasks, completeTask, acceptTask } = useDatabaseStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch Supabase zones for the reporting dropdown
  const { zones: supabaseZones } = useRealtimeZones();

  // Form states for reporting
  const [type, setType] = useState<"Medical" | "Security" | "Maintenance">("Medical");
  const [locationZoneId, setLocationZoneId] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");

  // Submission / Loading / Alert States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const submissionInFlight = useRef(false);
  const successTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(successTimer.current), []);

  // Split tasks by status for the radar
  const pendingTasks = Object.values(tasks).filter(t => t.status === 'pending');
  const activeTasks = Object.values(tasks).filter(t => t.status === 'active');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();

    // A state update does not disable the button synchronously; this closes the
    // double-click / key-repeat window before a second network request can start.
    if (submissionInFlight.current) return;

    const normalizedDescription = description.trim();
    if (!type || !locationZoneId || !normalizedDescription) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }
    if (normalizedDescription.length < 10 || normalizedDescription.length > 1000) {
      setErrorMsg("Description must be between 10 and 1,000 characters.");
      return;
    }

    submissionInFlight.current = true;
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        throw authError ?? new Error("Your session has expired. Please sign in again.");
      }

      // Insert new incident into Supabase
      const { error } = await supabase
        .from("incidents")
        .insert({
          title: `${type} Incident`,
          description: normalizedDescription,
          priority: severity,
          location_zone_id: locationZoneId,
          reported_by: authData.user.id,
          status: "open" // Maps to public.incident_status which is ('open', 'assigned', 'resolved')
        });

      if (error) throw error;

      setSuccessMsg("Incident reported successfully! Command center notified.");
      
      // Reset form
      setDescription("");
      setLocationZoneId("");
      setSeverity("medium");
      setType("Medical");

      // Auto-hide success toast after 4 seconds
      window.clearTimeout(successTimer.current);
      successTimer.current = window.setTimeout(() => setSuccessMsg(null), 4000);

    } catch (err: unknown) {
      console.error("Error reporting incident to Supabase:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to submit incident report. Please try again.";
      setErrorMsg(errMsg);
    } finally {
      submissionInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen relative font-sans">
      
      <div className="flex items-center justify-between mb-8 mt-4 md:mt-0">
        <div>
          <h1 className="text-[length:var(--font-size-3xl)] font-bold text-text-primary tracking-tight leading-none">Task Radar</h1>
          <p className="text-[length:var(--font-size-sm)] font-medium text-text-secondary mt-1">
            {activeTasks.length} Active • {pendingTasks.length} Pending
          </p>
        </div>
        
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-brand-emerald text-white font-bold text-[length:var(--font-size-sm)] px-4 py-2.5 rounded-xl shadow-elevation-1 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 md:hidden"
        >
          <Plus className="w-5 h-5" /> Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Active Shift and Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Active Shift Bento Card */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-brand-blue/5 rounded-3xl p-6 border border-brand-blue/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-glow-blue">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-[length:var(--font-size-lg)] font-bold text-text-primary">Current Deployment: Sector 104</h2>
                  <p className="text-[length:var(--font-size-sm)] text-brand-blue font-medium">Shift ends in 2h 15m</p>
                </div>
              </div>
              <button className="bg-surface-elevated text-brand-blue border border-brand-blue/30 px-5 py-2.5 rounded-xl text-[length:var(--font-size-sm)] font-bold hover:bg-brand-blue/10 transition-colors shadow-sm">
                View Sector Map
              </button>
            </motion.div>

            {/* Pending & Active Tasks */}
            <AnimatePresence>
              {Object.values(tasks).filter(t => t.status !== 'completed').map(task => (
                <motion.div
                  key={task.id}
                  layout
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`col-span-1 rounded-3xl p-6 shadow-elevation-2 relative overflow-hidden group ${
                    task.status === 'active' ? 'bg-surface-elevated border-brand-blue border-2' : 'bg-surface-elevated border border-border-subtle hover:border-border-strong'
                  }`}
                >
                  {/* Highlight bar for high priority */}
                  {task.priority === 'high' && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-state-danger" />
                  )}
                  {task.status === 'active' && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-blue" />
                  )}

                  <div className="flex justify-between items-start mb-4 mt-2">
                    <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === 'high' ? 'bg-state-danger/10 text-state-danger' : 'bg-surface-base text-text-secondary border border-border-subtle'
                    }`}>
                      {task.priority} Priority
                    </div>
                    <span className="text-[length:var(--font-size-xs)] font-medium text-text-tertiary">2m ago</span>
                  </div>

                  <h3 className="text-[length:var(--font-size-xl)] font-bold text-text-primary leading-tight mb-2 tracking-tight">{task.title}</h3>
                  <p className="text-[length:var(--font-size-sm)] text-text-secondary mb-6 leading-relaxed line-clamp-3">{task.description}</p>

                  <div className="mt-auto">
                    {task.status === 'pending' ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => acceptTask(task.id, 'vol-1')}
                        className={`w-full py-3 rounded-xl font-bold text-[length:var(--font-size-sm)] transition-colors ${
                          task.priority === 'high' 
                          ? 'bg-state-danger hover:bg-state-danger/90 text-white shadow-elevation-1' 
                          : 'bg-surface-base hover:bg-surface-sunken border border-border-strong text-text-primary'
                        }`}
                      >
                        Accept Task
                      </motion.button>
                    ) : (
                      <div className="flex gap-2">
                        <button className="w-12 h-12 shrink-0 bg-surface-base hover:bg-surface-sunken border border-border-strong rounded-xl flex items-center justify-center transition-colors">
                          <Navigation className="w-5 h-5 text-brand-blue" />
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => completeTask(task.id)}
                          className="flex-1 bg-surface-base border border-border-strong hover:bg-brand-emerald/10 hover:border-brand-emerald text-text-primary hover:text-brand-emerald font-bold text-[length:var(--font-size-sm)] rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                          <CheckCircle className="w-5 h-5" /> Complete
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: Report Incident Widget */}
        <div className="lg:col-span-1">
          <div className="bg-surface-elevated rounded-3xl p-6 border border-border-subtle shadow-elevation-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <div className="w-8 h-8 rounded-lg bg-state-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-state-danger" />
              </div>
              <div>
                <h2 className="text-[length:var(--font-size-base)] font-bold text-text-primary">Report New Incident</h2>
                <p className="text-[10px] text-text-tertiary">Real-time dispatch system</p>
              </div>
            </div>

            <form onSubmit={handleReportIncident} className="space-y-4">
              {/* Type Dropdown */}
              <div className="space-y-1">
                <label htmlFor="incident-type" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Incident Type</label>
                <select
                  id="incident-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as "Medical" | "Security" | "Maintenance")}
                  className="w-full bg-surface-base border border-border-strong rounded-xl px-3 py-2.5 text-[length:var(--font-size-sm)] text-text-primary focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all cursor-pointer"
                >
                  <option value="Medical">Medical</option>
                  <option value="Security">Security</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {/* Location Zone Dropdown */}
              <div className="space-y-1">
                <label htmlFor="incident-location" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Location / Zone</label>
                <select
                  id="incident-location"
                  value={locationZoneId}
                  onChange={(e) => setLocationZoneId(e.target.value)}
                  className="w-full bg-surface-base border border-border-strong rounded-xl px-3 py-2.5 text-[length:var(--font-size-sm)] text-text-primary focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all cursor-pointer"
                >
                  <option value="">Select Zone...</option>
                  {supabaseZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity Toggle */}
              <div className="space-y-1">
                <span id="incident-severity-label" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Severity</span>
                <div role="group" aria-labelledby="incident-severity-label" className="grid grid-cols-3 gap-2 bg-surface-base p-1 rounded-xl border border-border-strong">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={severity === level}
                      onClick={() => setSeverity(level)}
                      className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        severity === level
                          ? level === "high"
                            ? "bg-state-danger text-white shadow-elevation-1"
                            : level === "medium"
                            ? "bg-brand-blue text-white shadow-elevation-1"
                            : "bg-text-secondary text-surface-base shadow-elevation-1"
                          : "text-text-tertiary hover:text-text-secondary"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-1">
                <label htmlFor="incident-description" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Description</label>
                <textarea
                  id="incident-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={3}
                  maxLength={1000}
                  required
                  aria-describedby="incident-description-help"
                  className="w-full bg-surface-base border border-border-strong rounded-xl px-3 py-2 text-[length:var(--font-size-sm)] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none"
                />
                <p id="incident-description-help" className="text-[10px] text-text-secondary">
                  {description.length}/1000 characters (minimum 10)
                </p>
              </div>

              {/* Error/Success Feedbacks */}
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    role="alert"
                    className="bg-state-danger/10 border border-state-danger/20 text-state-danger text-xs font-medium rounded-xl p-3 flex items-center gap-2"
                  >
                    <span>⚠️</span> {errorMsg}
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    role="status"
                    className="bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-medium rounded-xl p-3 flex items-center gap-2"
                  >
                    <span>✅</span> {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !locationZoneId || !description.trim()}
                className="w-full bg-brand-blue text-white font-bold text-sm py-3 rounded-xl shadow-elevation-1 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Incident"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <IncidentDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
