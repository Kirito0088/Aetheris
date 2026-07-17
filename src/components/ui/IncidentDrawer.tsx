"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X, AlertTriangle, MapPin } from "lucide-react";
import { useDatabaseStore, type Priority } from "@/store/useDatabaseStore";

interface IncidentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IncidentFormData {
  title: string;
  description: string;
  priority: Priority;
  locationZoneId: string;
}

export function IncidentDrawer({ isOpen, onClose }: IncidentDrawerProps) {
  const { reportIncident, zones } = useDatabaseStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IncidentFormData>({
    defaultValues: { priority: 'medium' }
  });

  const onSubmit = (data: IncidentFormData) => {
    reportIncident({
      title: data.title,
      description: data.description,
      priority: data.priority,
      locationZoneId: data.locationZoneId,
      status: 'open'
    });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-primary/10 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-surface-elevated rounded-t-3xl shadow-elevation-3 border-t border-border-subtle z-[101] overflow-hidden flex flex-col max-w-2xl mx-auto"
          >
            {/* iOS style drag handle */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-border-strong rounded-full" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4 border-b border-border-subtle">
              <h2 className="text-[length:var(--font-size-lg)] font-bold text-text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-state-danger" />
                Report Incident
              </h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-base transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-[length:var(--font-size-sm)] font-semibold text-text-primary">Incident Title</label>
                <input 
                  {...register("title", { required: true })}
                  placeholder="e.g. Broken turnstile at Gate C"
                  className="w-full bg-surface-base border border-border-strong rounded-xl px-4 py-3 text-[length:var(--font-size-base)] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
                {errors.title && <span className="text-state-danger text-[length:var(--font-size-xs)]">Title is required</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[length:var(--font-size-sm)] font-semibold text-text-primary">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <select 
                    {...register("locationZoneId", { required: true })}
                    className="w-full bg-surface-base border border-border-strong rounded-xl pl-10 pr-4 py-3 text-[length:var(--font-size-base)] text-text-primary appearance-none focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  >
                    <option value="">Select Zone</option>
                    {Object.values(zones).map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>
                {errors.locationZoneId && <span className="text-state-danger text-[length:var(--font-size-xs)]">Location is required</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[length:var(--font-size-sm)] font-semibold text-text-primary">Description</label>
                <textarea 
                  {...register("description", { required: true })}
                  placeholder="Provide additional details..."
                  rows={3}
                  className="w-full bg-surface-base border border-border-strong rounded-xl px-4 py-3 text-[length:var(--font-size-base)] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[length:var(--font-size-sm)] font-semibold text-text-primary">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <label key={p} className="relative cursor-pointer">
                      <input 
                        type="radio" 
                        value={p} 
                        {...register("priority")} 
                        className="peer sr-only" 
                      />
                      <div className="w-full text-center capitalize text-[length:var(--font-size-sm)] font-medium text-text-secondary bg-surface-base border border-border-strong rounded-xl py-2.5 peer-checked:border-brand-blue peer-checked:bg-brand-blue/5 peer-checked:text-brand-blue transition-all">
                        {p}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle">
                <button 
                  type="submit"
                  className="w-full bg-brand-blue text-white font-semibold text-[length:var(--font-size-base)] py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-elevation-2 flex items-center justify-center gap-2"
                >
                  Submit Report
                </button>
              </div>

            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
