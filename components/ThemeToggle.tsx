// components/ThemeToggle.tsx
"use client";
import { useTheme } from "@/app/providers/ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition"
        >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>
    );
}