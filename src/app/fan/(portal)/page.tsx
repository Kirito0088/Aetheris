"use client";

import React from "react";
import { useFanExperienceStore } from "@/store/useFanExperienceStore";
import { InteractiveStadiumMap } from "@/components/ui/InteractiveStadiumMap";
import { ArrowRight, MapPin, Ticket, Sparkles, Navigation } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { SmartWayfindingBanner } from "@/components/shared/SmartWayfindingBanner";

export default function FanPage() {
  const { ticket, alerts, dismissAlert } = useFanExperienceStore();
  const { t } = useLanguage();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative min-h-[100dvh] pb-28 md:pb-12 font-sans">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120%] md:w-[80%] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Smart Wayfinding — AI-powered navigation recommendation */}
      <SmartWayfindingBanner fanSector={ticket.sector} fanGate={ticket.gate} />

      {/* Page Header */}
      <div className="flex justify-between items-start mb-6 mt-2 md:mt-0 flex-wrap gap-4">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
            {t("welcome")}
          </h1>
          <p className="text-base text-text-secondary mt-1">
            {t("subWelcome")}
          </p>
        </motion.div>

        <LanguageSwitcher />
      </div>

      {/* Mobile-Native Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
      >
        {/* Digital Ticket Mobile Pass (Span 12 on mobile, 4 on desktop) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 h-full">
          <div className="relative h-full bg-surface-elevated rounded-3xl p-6 shadow-elevation-2 border border-border-subtle overflow-hidden group">
            {/* Top Brand Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue to-brand-emerald" />

            <div className="flex justify-between items-start mb-6 relative z-20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                  <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider" style={{ fontFamily: "var(--font-data)" }}>
                    {t("liveMatch")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
                  {ticket.match}
                </h2>
                <p className="text-sm text-text-secondary font-medium">{ticket.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-6 relative z-20">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Ticket className="w-4 h-4 text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary" style={{ fontFamily: "var(--font-data)" }}>
                    {t("yourSeat")}
                  </span>
                </div>
                <div className="text-xl font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
                  Sec {ticket.sector}
                </div>
                <div className="text-xs text-text-secondary">Row {ticket.row}, Seat {ticket.seat}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary" style={{ fontFamily: "var(--font-data)" }}>
                    {t("entryGate")}
                  </span>
                </div>
                <div className="text-xl font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
                  {ticket.gate}
                </div>
                <div className="text-xs text-brand-blue font-semibold mt-1 bg-brand-blue/10 w-fit px-2 py-0.5 rounded-md" style={{ fontFamily: "var(--font-data)" }}>
                  {t("gateOpenIn")}
                </div>
              </div>
            </div>

            {/* Cutouts for pass look */}
            <div className="absolute top-[65%] -left-4 w-8 h-8 bg-surface-base rounded-full border-r border-border-subtle z-20" />
            <div className="absolute top-[65%] -right-4 w-8 h-8 bg-surface-base rounded-full border-l border-border-subtle z-20" />
            <div className="absolute top-[65%] left-6 right-6 border-t-2 border-dashed border-border-subtle z-10" />
          </div>
        </motion.div>

        {/* Interactive Main Map (Span 12 on mobile, 8 on desktop) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-elevated rounded-3xl p-3 md:p-4 shadow-elevation-2 border border-border-subtle h-full flex flex-col">
            <div className="px-3 py-2 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
                {t("liveStadiumMap")}
              </h2>
              <button
                aria-label={t("viewFull")}
                className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:opacity-80 transition-opacity active:scale-95"
                style={{ fontFamily: "var(--font-data)" }}
              >
                {t("viewFull")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 w-full mt-1">
              <InteractiveStadiumMap />
            </div>
          </div>
        </motion.div>

        {/* AI Contextual Alerts */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-6">
          <div className="bg-surface-elevated rounded-3xl p-6 shadow-elevation-2 border border-border-subtle h-full">
            <div className="flex items-center gap-2 mb-4 text-text-secondary">
              <Sparkles className="w-5 h-5 text-brand-emerald" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-tertiary" style={{ fontFamily: "var(--font-data)" }}>
                {t("aetherisIntelligence")}
              </h2>
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
                        <h3 className="text-base font-bold text-text-primary tracking-tight">{alert.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{alert.description}</p>
                      </div>
                    </div>
                    {alert.actionLabel && (
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="mt-3 bg-surface-elevated border border-border-strong text-text-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-nav-hover active:scale-95 transition-all shadow-elevation-1 min-h-[44px]"
                        style={{ fontFamily: "var(--font-data)" }}
                      >
                        <Navigation className="w-4 h-4 text-brand-emerald" />
                        {alert.actionLabel}
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-text-tertiary text-sm">
                  <p>{t("noActiveAlerts")}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions (48px touch targets) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-6">
          <div className="bg-surface-elevated rounded-3xl p-6 shadow-elevation-2 border border-border-subtle h-full flex flex-col justify-center gap-3">
            <h2 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-data)" }}>
              {t("quickActions")}
            </h2>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-between p-4 min-h-[48px] rounded-2xl bg-surface-sunken border border-border-subtle hover:bg-surface-base transition-colors shadow-elevation-1 group"
            >
              <span className="font-semibold text-text-primary text-base">{t("orderFood")}</span>
              <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-between p-4 min-h-[48px] rounded-2xl bg-surface-sunken border border-border-subtle hover:bg-surface-base transition-colors shadow-elevation-1 group"
            >
              <span className="font-semibold text-text-primary text-base">{t("reportIssue")}</span>
              <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
