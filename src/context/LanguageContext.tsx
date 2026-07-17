"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Language = "en" | "es" | "fr";

export const translations = {
  en: {
    welcome: "Welcome to Azteca",
    subWelcome: "Your World Cup 2026 experience starts here.",
    liveMatch: "Live Match",
    yourSeat: "Your Seat",
    entryGate: "Entry Gate",
    gateOpenIn: "Opens in 45m",
    liveStadiumMap: "Live Stadium Map",
    viewFull: "View Full",
    aetherisIntelligence: "Aetheris Intelligence",
    noActiveAlerts: "No active alerts right now.",
    quickActions: "Quick Actions",
    orderFood: "Order Food to Seat",
    reportIssue: "Report an Issue",
    findMySeat: "Find My Seat",
    currentWaitTime: "Current Wait Time",
    foodBeverage: "Food & Beverage",
  },
  es: {
    welcome: "Bienvenido al Azteca",
    subWelcome: "Tu experiencia del Mundial 2026 comienza aquí.",
    liveMatch: "Partido en Vivo",
    yourSeat: "Tu Asiento",
    entryGate: "Puerta de Entrada",
    gateOpenIn: "Abre en 45m",
    liveStadiumMap: "Mapa del Estadio en Vivo",
    viewFull: "Ver Completo",
    aetherisIntelligence: "Inteligencia Aetheris",
    noActiveAlerts: "No hay alertas activas en este momento.",
    quickActions: "Acciones Rápidas",
    orderFood: "Pedir Comida al Asiento",
    reportIssue: "Reportar un Problema",
    findMySeat: "Buscar Mi Asiento",
    currentWaitTime: "Tiempo de Espera Actual",
    foodBeverage: "Alimentos y Bebidas",
  },
  fr: {
    welcome: "Bienvenue à l'Azteca",
    subWelcome: "Votre expérience de la Coupe du Monde 2026 commence ici.",
    liveMatch: "Match en Direct",
    yourSeat: "Votre Siège",
    entryGate: "Porte d'Entrée",
    gateOpenIn: "Ouvre dans 45m",
    liveStadiumMap: "Carte du Stade en Direct",
    viewFull: "Voir Tout",
    aetherisIntelligence: "Intelligence Aetheris",
    noActiveAlerts: "Aucune alerte active pour le moment.",
    quickActions: "Actions Rapides",
    orderFood: "Commander à Manger",
    reportIssue: "Signaler un Problème",
    findMySeat: "Trouver Mon Siège",
    currentWaitTime: "Temps d'Attente Actuel",
    foodBeverage: "Nourriture et Boissons",
  },
};

export type TranslationKeys = keyof typeof translations["en"];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = "aetheris_fan_language";
const languageListeners = new Set<() => void>();

function getStoredLanguage(): Language {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage === "es" || storedLanguage === "fr" ? storedLanguage : "en";
  } catch {
    return "en";
  }
}

function subscribeToLanguage(listener: () => void) {
  languageListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LANGUAGE_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    languageListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function notifyLanguageListeners() {
  languageListeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore<Language>(
    subscribeToLanguage,
    getStoredLanguage,
    () => "en",
  );

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      notifyLanguageListeners();
    } catch (e) {
      console.warn("Failed to save language to localStorage", e);
    }
  }, []);

  const t = useCallback((key: TranslationKeys): string => {
    return translations[language][key] || translations["en"][key] || key;
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  // The server snapshot is English; useSyncExternalStore applies any persisted
  // client preference only after hydration, so text nodes always hydrate safely.
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
