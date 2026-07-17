"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { type Language, useLanguage } from "@/context/LanguageContext";

const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "fr", label: "Français", short: "FR" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const activeLanguage = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0]!;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const close = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const selectLanguage = (code: Language) => {
    setLanguage(code);
    close(true);
  };

  const openListbox = () => {
    setFocusedIndex(Math.max(0, LANGUAGES.findIndex((item) => item.code === language)));
    setIsOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && focusedIndex >= 0 && LANGUAGES[focusedIndex]) {
          selectLanguage(LANGUAGES[focusedIndex].code);
        } else {
          openListbox();
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) openListbox();
        else setFocusedIndex((index) => (index + 1) % LANGUAGES.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) openListbox();
        else setFocusedIndex((index) => (index - 1 + LANGUAGES.length) % LANGUAGES.length);
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          close(true);
        }
        break;
      case "Tab":
        close();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={
          isOpen && focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined
        }
        aria-label={`Select language. Current language: ${activeLanguage.label}`}
        data-testid="language-switcher-trigger"
        className="flex items-center gap-2 rounded-xl border border-border-default bg-surface-elevated px-3 py-2 transition-colors hover:bg-surface-sunken focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
        onClick={() => (isOpen ? close() : openListbox())}
        onKeyDown={handleKeyDown}
      >
        <Globe className="h-4 w-4 text-text-secondary" aria-hidden="true" />
        <span className="text-[length:var(--font-size-sm)] font-semibold text-text-primary">
          {activeLanguage.short}
        </span>
        <ChevronDown className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-label="Available languages"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-border-default bg-surface-elevated py-1 shadow-elevation-3"
          >
            {LANGUAGES.map((item, index) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-testid={`language-option-${item.code}`}
                  onClick={() => selectLanguage(item.code)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left text-[length:var(--font-size-sm)] transition-colors focus:outline-none ${
                    focusedIndex === index ? "bg-nav-hover" : ""
                  } ${isSelected ? "font-bold text-brand-blue" : "font-medium text-text-primary"}`}
                >
                  {item.label}
                  {isSelected && <Check className="h-4 w-4 text-brand-blue" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
