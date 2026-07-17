"use client";

import React from "react";
import { useFanExperienceStore } from "@/store/useFanExperienceStore";
import { InteractiveStadiumMap } from "@/components/ui/InteractiveStadiumMap";
import { ArrowRight, MapPin, Ticket, Sparkles, Navigation } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function FanPage() {
  const { ticket, alerts, dismissAlert } = useFanExperienceStore();
  const { t } = useLanguage();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative min-h-screen">
      {/* Premium ambient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] md:w-[80%] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="flex justify-between items-start mb-8 mt-4 md:mt-0 flex-wrap gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-[length:var(--font-size-3xl)] md:text-[length:var(--font-size-4xl)] font-bold text-text-primary tracking-tight">
            {t('welcome')}
          </h1>
          <p className="text-[length:var(--font-size-lg)] text-text-secondary mt-1">
            {t('subWelcome')}
          </p>
        </motion.div>
        
        <LanguageSwitcher />
      </div>

      {/* Bento Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
      >
        {/* Digital Ticket (Span 12 on mobile, 4 on desktop) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 h-full">
          <div className="relative h-full bg-surface-elevated rounded-3xl p-6 shadow-elevation-3 border border-border-subtle overflow-hidden group">
            {/* Shiny Gradient Sweep (Premium detail) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[aetheris-sheen_2s_infinite]" />
            </div>

            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue to-brand-emerald" />
            
            <div className="flex justify-between items-start mb-8 relative z-20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                  <span className="text-[length:var(--font-size-xs)] font-bold text-brand-emerald uppercase tracking-wider">{t('liveMatch')}</span>
                </div>
                <h2 className="text-[length:var(--font-size-2xl)] font-bold text-text-primary tracking-tight">{ticket.match}</h2>
                <p className="text-[length:var(--font-size-sm)] text-text-secondary font-medium">{ticket.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-6 relative z-20">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Ticket className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('yourSeat')}</span>
                </div>
                <div className="text-[length:var(--font-size-xl)] font-bold text-text-primary tracking-tight">Sec {ticket.sector}</div>
                <div className="text-[length:var(--font-size-sm)] text-text-secondary">Row {ticket.row}, Seat {ticket.seat}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('entryGate')}</span>
                </div>
                <div className="text-[length:var(--font-size-xl)] font-bold text-text-primary tracking-tight">{ticket.gate}</div>
                <div className="text-[length:var(--font-size-sm)] text-brand-blue font-medium mt-1 bg-brand-blue/10 w-fit px-2 py-0.5 rounded-md">
                  {t('gateOpenIn')}
                </div>
              </div>
            </div>
            
            {/* Cutouts for pass look */}
            <div className="absolute top-[65%] -left-4 w-8 h-8 bg-surface-base rounded-full border-r border-border-subtle z-20" />
            <div className="absolute top-[65%] -right-4 w-8 h-8 bg-surface-base rounded-full border-l border-border-subtle z-20" />
            <div className="absolute top-[65%] left-6 right-6 border-t-2 border-dashed border-border-subtle z-10" />
          </div>
        </motion.div>

        {/* Interactive Map Card (Span 12 on mobile, 8 on desktop) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-elevated rounded-3xl p-2 pb-6 shadow-elevation-2 border border-border-subtle h-full flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between">
              <h2 className="text-[length:var(--font-size-lg)] font-bold text-text-primary tracking-tight">{t('liveStadiumMap')}</h2>
              <button aria-label={t('viewFull')} className="text-[length:var(--font-size-sm)] font-medium text-brand-blue flex items-center gap-1 hover:opacity-80 transition-opacity">
                {t('viewFull')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 px-2">
              <InteractiveStadiumMap />
            </div>
          </div>
        </motion.div>

        {/* AI Contextual Alerts (Span 12 on mobile, 6 on desktop) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-6">
          <div className="bg-surface-elevated rounded-3xl p-6 shadow-elevation-2 border border-border-subtle h-full">
            <div className="flex items-center gap-2 mb-4 text-text-secondary">
              <Sparkles className="w-5 h-5 text-brand-emerald" />
              <h2 className="text-[length:var(--font-size-sm)] font-bold uppercase tracking-wider">{t('aetherisIntelligence')}</h2>
            </div>
            
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl bg-surface-sunken border border-border-subtle relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-emerald" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[length:var(--font-size-base)] font-bold text-text-primary tracking-tight">{alert.title}</h3>
                        <p className="text-[length:var(--font-size-sm)] text-text-secondary mt-1">{alert.description}</p>
                      </div>
                    </div>
                    {alert.actionLabel && (
                      <button 
                        onClick={() => dismissAlert(alert.id)}
                        className="mt-3 bg-surface-elevated border border-border-strong text-text-primary text-[length:var(--font-size-sm)] font-semibold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-nav-hover active:scale-95 transition-all shadow-elevation-1"
                      >
                        <Navigation className="w-4 h-4 text-brand-emerald" />
                        {alert.actionLabel}
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-text-tertiary">
                  <p>{t('noActiveAlerts')}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions (Span 12 on mobile, 6 on desktop) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-6">
          <div className="bg-surface-elevated rounded-3xl p-6 shadow-elevation-2 border border-border-subtle h-full flex flex-col justify-center gap-3">
             <h2 className="text-[length:var(--font-size-sm)] font-bold text-text-tertiary uppercase tracking-wider mb-2">{t('quickActions')}</h2>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-sunken border border-border-subtle hover:bg-surface-base transition-colors shadow-elevation-1 group"
             >
               <span className="font-semibold text-text-primary text-[length:var(--font-size-base)]">{t('orderFood')}</span>
               <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
             </motion.button>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-sunken border border-border-subtle hover:bg-surface-base transition-colors shadow-elevation-1 group"
             >
               <span className="font-semibold text-text-primary text-[length:var(--font-size-base)]">{t('reportIssue')}</span>
               <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
             </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
