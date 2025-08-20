// app/providers/ThemeProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactNode
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  systemTheme: Theme;
  resolvedTheme: Theme;
  mounted: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "jtp.theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyDocumentClass(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  const [systemTheme, setSystemTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") return getSystemTheme();
    return "light";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") {
        if (stored !== theme) {
          setThemeState(stored);
          applyDocumentClass(stored);
        }
      } else {
        const sys = getSystemTheme();
        setSystemTheme(sys);
        if (sys !== theme) {
          setThemeState(sys);
          applyDocumentClass(sys);
        }
      }
    } catch { /* ignore */ }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = mq.matches ? "dark" : "light";
      setSystemTheme(next);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setThemeState(next);
        applyDocumentClass(next);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyDocumentClass(t);
    try {
      if (t === getSystemTheme()) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, t);
    } catch { /* ignore */ }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyDocumentClass(next);
      try {
        if (next === getSystemTheme()) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, next);
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const value: ThemeContextValue = {
    theme,
    systemTheme,
    resolvedTheme: theme,
    mounted,
    setTheme,
    toggleTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}