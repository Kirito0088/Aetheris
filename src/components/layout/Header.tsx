'use client';

import { motion } from 'framer-motion';
import { useExperienceDirector, MOTION_TIMINGS, MOTION_EASINGS } from '@/features/experience';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Volume2, VolumeX, ChevronRight } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { audioEnabled, setAudioEnabled } = useExperienceDirector();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: MOTION_TIMINGS.transition / 1000,
        ease: MOTION_EASINGS.emphasized,
      }}
      className="sticky top-0 z-40 h-16 border-b border-stone-200/60 bg-[var(--stitch-surface)]/80 backdrop-blur-md flex items-center justify-between px-6"
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-3">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ZsHYGgiNNca6i-_lTLXk75iUHKDyT_L6uxz3-jijWyKosiKgA3oAye6acNjDjHc8hwsBFEIyZQ8W3xWoyVsSP5iEdSf8lBubxjJwxpcn_VxBBh2dPXkwY43wWlzjJzbX9Sy41lXfAvK9FAmlBk6xsNdzyFO6UmXaxe5XhSH5OOP6XY-Jpw6TnT8yXM6yjUvWbys5LWqsoPnnO5MOLfVKKNDiH4-PQtXKUKJhf26YkX2SHl4RvgmBLU_aJ9BRgkk3mw"
          alt="Venue"
          className="w-6 h-6 rounded-md object-cover"
        />
        <span
          className="text-sm text-[var(--stitch-on-surface-variant)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Estadio Azteca
        </span>
        <ChevronRight className="w-4 h-4 text-[var(--stitch-on-surface-variant)]" />
        <span
          className="text-sm font-semibold text-[var(--stitch-primary)]"
        >
          {title}
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Audio Toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="w-10 h-10 rounded-full border border-stone-200/60 flex items-center justify-center text-[var(--stitch-on-surface-variant)] hover:text-[var(--stitch-on-surface)] hover:bg-[var(--surface-sunken)]/50 transition-colors"
          aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
        >
          {audioEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>

        {/* LIVE Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200/60 bg-emerald-50/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span
            className="text-xs uppercase tracking-wider text-emerald-700 font-medium"
            style={{ fontFamily: 'var(--font-data)', fontSize: '12px' }}
          >
            LIVE
          </span>
        </div>

        <SignOutButton />
      </div>
    </motion.header>
  );
}
