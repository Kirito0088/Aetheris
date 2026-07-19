'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { MOTION_TIMINGS, MOTION_EASINGS } from '@/features/experience';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Home, Map, Users, AlertTriangle } from 'lucide-react';

const venueOperationsItems = [
  { label: 'Dashboard', href: '/venue-operations', icon: Home },
  { label: 'Venue Guide', href: '/venue-operations/guide', icon: Map },
  { label: 'Dispatch', href: '/venue-operations/dispatch', icon: Users },
  { label: 'Incidents', href: '/venue-operations/incidents', icon: AlertTriangle },
];

const MotionLink = motion.create(Link);

export function Sidebar({ _persona }: { _persona?: 'venue-operations' }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-stone-200/60 bg-[var(--stitch-surface)] flex flex-col py-8">
      {/* Logo Area */}
      <div className="px-8 mb-12 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Aetheris logo"
          className="w-10 h-10 rounded-lg object-cover shadow-sm"
        />
        <div>
          <h1
            className="text-lg font-bold text-[var(--stitch-on-surface)]"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Aetheris
          </h1>
          <span
            className="text-[10px] uppercase tracking-wider text-[var(--stitch-on-surface-variant)] block"
            style={{ fontFamily: 'var(--font-data)' }}
          >
            Operations
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col flex-grow gap-2 px-4">
        {venueOperationsItems.map((item, index) => {
          const isActive =
            item.href === '/venue-operations'
              ? pathname === '/venue-operations'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <MotionLink
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: MOTION_TIMINGS.transition / 1000,
                ease: MOTION_EASINGS.emphasized,
                delay: index * 0.06,
              }}
              className={clsx(
                'relative flex items-center gap-4 px-4 py-3 rounded-r-full transition-colors',
                isActive
                  ? 'bg-[var(--stitch-secondary-container)] text-[var(--stitch-on-secondary-container)] font-semibold'
                  : 'text-[var(--stitch-on-surface-variant)] hover:text-[var(--stitch-on-surface)] hover:bg-[var(--surface-sunken)]/50'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm">{item.label}</span>
            </MotionLink>
          );
        })}
      </nav>

      {/* Bottom: Sign Out */}
      <div className="px-4 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-[var(--surface-sunken)] shrink-0" />
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
