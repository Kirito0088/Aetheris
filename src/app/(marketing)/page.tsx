'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Users,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Navigation,
  Accessibility,
  Brain,
} from 'lucide-react';
import { DigitalTwinCanvas } from '@/features/digital-twin/components';
import {
  useExperienceDirector,
  playConfirmationSound,
  playClickSound,
} from '@/features/experience';
import { MOTION_EASINGS } from '@/features/experience';
import { GradientText, CountUp } from '@/components/reactbits';

/* ---------------------------------------------------------------------------
   MOTION CONSTANTS
   --------------------------------------------------------------------------- */
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: MOTION_EASINGS.emphasized },
  }),
};

const CARD_HOVER = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: MOTION_EASINGS.decelerate } },
};

/* ---------------------------------------------------------------------------
   FEATURE HIGHLIGHTS
   --------------------------------------------------------------------------- */
const FEATURES = [
  {
    icon: MapPin,
    title: 'Living Digital Twin',
    description: 'Real-time 3D stadium model with spatial awareness across every zone, gate, and pathway.',
  },
  {
    icon: Navigation,
    title: 'Intelligent Navigation',
    description: 'AI-powered wayfinding with crowd-aware routing and step-free accessibility paths.',
  },
  {
    icon: Brain,
    title: 'AI Copilot',
    description: 'Proactive insights for crowd management, egress optimization, and incident response.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility First',
    description: 'Complete wheelchair routing, elevator mapping, and assistance point discovery.',
  },
];

/* ---------------------------------------------------------------------------
   STATS
   --------------------------------------------------------------------------- */
const STATS = [
  { value: 80000, suffix: '+', label: 'Capacity Managed' },
  { value: 68, suffix: '', label: 'Navigation Nodes' },
  { value: 4, suffix: '', label: 'Entry Gates' },
  { value: 99.9, suffix: '%', label: 'Uptime Target' },
];

/* ===========================================================================
   MARKETING PAGE
   =========================================================================== */
export default function MarketingPage() {
  const router = useRouter();
  const resetInitialization = useExperienceDirector((s) => s.resetInitialization);
  const setRole = useExperienceDirector((s) => s.setRole);

  const [showSelector, setShowSelector] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    resetInitialization();
  }, [resetInitialization]);

  /* ---- Handlers ---- */
  const handleEnterSelector = () => {
    playClickSound();
    setShowSelector(true);
  };

  const handleSelectFan = () => {
    playConfirmationSound();
    setRole('fan');
    resetInitialization();
    router.push('/live');
  };

  const handleSelectOrganizer = () => {
    playClickSound();
    setShowLogin(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (username === 'admin@aetheris.ai' && password === 'testing123') {
        playConfirmationSound();
        setRole('organizer');
        resetInitialization();
        router.push('/live');
      } else {
        playClickSound();
        setErrorMsg('Invalid credentials. Please check your email and password.');
        setIsSubmitting(false);
      }
    }, 600);
  };

  /* ======================================================================= */
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[var(--surface-base)] font-[var(--font-sans)] select-none text-[var(--text-primary)]">

      {/* ----------------------------------------------------------------- */}
      {/* HERO SECTION — Full viewport with 3D stadium background           */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* 3D Stadium Canvas — cinematic orbit as background */}
        <div className="absolute inset-0 z-0">
          <DigitalTwinCanvas />
        </div>

        {/* Gradient overlays — warm white from bottom, soft vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(
              to top,
              var(--surface-base) 0%,
              hsla(40, 38%, 98%, 0.85) 25%,
              hsla(40, 38%, 98%, 0.4) 50%,
              transparent 75%
            )`,
          }}
        />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 30%, transparent 30%, hsla(40, 38%, 98%, 0.7) 80%)',
          }}
        />

        {/* Foreground Content */}
        <div className="relative z-20 w-full h-full flex flex-col">
          {/* Navbar */}
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: MOTION_EASINGS.decelerate }}
            className="flex items-center justify-between w-full px-6 sm:px-12 py-5"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--brand-blue)', color: 'white' }}
              >
                <span className="text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Aetheris
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{
                  background: 'hsla(214, 86%, 55%, 0.08)',
                  color: 'var(--brand-blue)',
                }}
              >
                FIFA World Cup 2026
              </span>
            </div>
          </motion.nav>

          {/* Hero Content Center */}
          <div className="flex-1 flex items-center justify-center px-6 sm:px-12">
            <AnimatePresence mode="wait">
              {!showSelector ? (
                /* ===== HERO WELCOME STATE ===== */
                <motion.div
                  key="hero-welcome"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: MOTION_EASINGS.emphasized }}
                  className="text-center max-w-2xl space-y-8"
                >
                  {/* Eyebrow */}
                  <motion.div
                    custom={0}
                    variants={FADE_UP}
                    initial="hidden"
                    animate="visible"
                  >
                    <span
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                      style={{
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--border-default)',
                        boxShadow: 'var(--elevation-1)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <Brain className="w-3.5 h-3.5" style={{ color: 'var(--brand-blue)' }} />
                      AI-Powered Spatial Intelligence
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.div
                    custom={1}
                    variants={FADE_UP}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <h1
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none"
                      style={{ color: 'var(--text-primary)', letterSpacing: 'var(--letter-spacing-tighter)' }}
                    >
                      The Stadium{' '}
                      <GradientText
                        colors={['hsl(214, 86%, 55%)', 'hsl(160, 84%, 39%)', 'hsl(214, 86%, 55%)']}
                        animationSpeed={6}
                        className="inline"
                      >
                        Thinks
                      </GradientText>
                    </h1>
                    <p
                      className="text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Aetheris transforms every venue into a living digital twin that predicts,
                      guides, and protects — in real time.
                    </p>
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    custom={2}
                    variants={FADE_UP}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-center gap-4"
                  >
                    <button
                      onClick={handleEnterSelector}
                      className="group flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: 'var(--brand-blue)',
                        color: 'white',
                        boxShadow: 'var(--glow-blue)',
                      }}
                    >
                      Explore Platform
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </motion.div>
                </motion.div>

              ) : !showLogin ? (
                /* ===== EXPERIENCE SELECTOR STATE ===== */
                <motion.div
                  key="experience-selector"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: MOTION_EASINGS.emphasized }}
                  className="w-full max-w-2xl space-y-8"
                >
                  <div className="text-center space-y-2">
                    <h2
                      className="text-2xl sm:text-3xl font-bold tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Choose Your Experience
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      Select how you&apos;d like to interact with the stadium digital twin.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Fan Card */}
                    <motion.div
                      variants={CARD_HOVER}
                      initial="rest"
                      whileHover="hover"
                      onClick={handleSelectFan}
                      className="group p-6 rounded-2xl cursor-pointer space-y-4 transition-colors duration-200"
                      style={{
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--border-default)',
                        boxShadow: 'var(--elevation-2)',
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: 'hsla(214, 86%, 55%, 0.08)' }}
                      >
                        <Users className="w-5 h-5" style={{ color: 'var(--brand-blue)' }} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                          Fan Experience
                        </h3>
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                          Navigate the stadium, find amenities, explore accessibility routes, and get AI-guided directions.
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1.5 text-xs font-semibold group-hover:translate-x-1 transition-transform duration-200"
                        style={{ color: 'var(--brand-blue)' }}
                      >
                        Enter as Guest
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>

                    {/* Organizer Card */}
                    <motion.div
                      variants={CARD_HOVER}
                      initial="rest"
                      whileHover="hover"
                      onClick={handleSelectOrganizer}
                      className="group p-6 rounded-2xl cursor-pointer space-y-4 transition-colors duration-200"
                      style={{
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--border-default)',
                        boxShadow: 'var(--elevation-2)',
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: 'hsla(160, 84%, 39%, 0.08)' }}
                      >
                        <ShieldCheck className="w-5 h-5" style={{ color: 'var(--brand-emerald)' }} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                          Operations Console
                        </h3>
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                          Full command dashboard with security alerts, crowd analytics, path planning, and dispatch coordination.
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1.5 text-xs font-semibold group-hover:translate-x-1 transition-transform duration-200"
                        style={{ color: 'var(--brand-emerald)' }}
                      >
                        Sign In
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => { playClickSound(); setShowSelector(false); }}
                      className="text-xs font-medium cursor-pointer hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      ← Back
                    </button>
                  </div>
                </motion.div>

              ) : (
                /* ===== LOGIN OVERLAY STATE ===== */
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: MOTION_EASINGS.decelerate }}
                  className="w-full max-w-md rounded-2xl p-7 md:p-8 space-y-6"
                  style={{
                    background: 'var(--surface-glass-strong)',
                    backdropFilter: 'blur(var(--blur-xl))',
                    border: '1px solid var(--border-default)',
                    boxShadow: 'var(--elevation-4)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'hsla(160, 84%, 39%, 0.08)' }}
                    >
                      <ShieldCheck className="w-5 h-5" style={{ color: 'var(--brand-emerald)' }} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Operations Sign In
                      </h3>
                      <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                        Authenticate to access the command dashboard
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {errorMsg && (
                      <div
                        className="p-3 rounded-xl flex items-start gap-2 text-xs animate-shake"
                        style={{
                          background: 'var(--color-red-50)',
                          border: '1px solid hsla(0, 78%, 55%, 0.2)',
                          color: 'var(--color-red-600)',
                        }}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Email
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin@aetheris.ai"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: 'var(--surface-sunken)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: 'var(--surface-sunken)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        required
                      />
                    </div>

                    <div
                      className="p-3 rounded-xl text-[11px] leading-relaxed"
                      style={{
                        background: 'var(--color-blue-50)',
                        border: '1px solid hsla(214, 86%, 55%, 0.12)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Demo Credentials
                      </span>
                      <br />
                      Email: <code className="font-mono text-[11px]" style={{ color: 'var(--brand-blue)' }}>admin@aetheris.ai</code>
                      {' · '}
                      Password: <code className="font-mono text-[11px]" style={{ color: 'var(--brand-blue)' }}>testing123</code>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                      style={{
                        background: isSubmitting ? 'var(--color-neutral-200)' : 'var(--brand-blue)',
                        color: isSubmitting ? 'var(--text-disabled)' : 'white',
                        boxShadow: isSubmitting ? 'none' : 'var(--glow-blue)',
                      }}
                    >
                      {isSubmitting ? 'Verifying…' : 'Sign In'}
                    </button>
                  </form>

                  <div className="text-center">
                    <button
                      onClick={() => { playClickSound(); setShowLogin(false); setErrorMsg(null); }}
                      className="text-xs font-medium cursor-pointer hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      ← Back to Experiences
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Bar — bottom of hero */}
          {!showSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="px-6 sm:px-12 pb-8"
            >
              <div
                className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 px-6 py-4 rounded-2xl"
                style={{
                  background: 'var(--surface-glass)',
                  backdropFilter: 'blur(var(--blur-lg))',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className="text-xl sm:text-2xl font-bold tabular-nums"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                    >
                      <CountUp to={stat.value} duration={2} />
                      {stat.suffix}
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FEATURES SECTION — Below the fold                                 */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative z-20 px-6 sm:px-12 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: MOTION_EASINGS.emphasized }}
            className="text-center space-y-4 max-w-2xl mx-auto"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'hsla(214, 86%, 55%, 0.06)',
                color: 'var(--brand-blue)',
              }}
            >
              Platform Capabilities
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Everything a Stadium Needs
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              From crowd intelligence to accessibility routing, Aetheris provides a unified spatial operations layer for FIFA-scale events.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: MOTION_EASINGS.emphasized }}
                className="p-6 rounded-2xl transition-shadow duration-300 hover:shadow-lg"
                style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--elevation-1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'hsla(214, 86%, 55%, 0.06)' }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: 'var(--brand-blue)' }} />
                </div>
                <h3
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FOOTER                                                            */}
      {/* ----------------------------------------------------------------- */}
      <footer
        className="relative z-20 px-6 sm:px-12 py-8"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'var(--brand-blue)', color: 'white' }}
            >
              <span className="text-[9px] font-bold">A</span>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              © 2026 Aetheris · Built for FIFA World Cup 2026
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--text-disabled)' }}>
            <span>Vancouver · Seattle · Mexico City</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
