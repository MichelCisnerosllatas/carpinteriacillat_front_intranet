// widget/theme/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";

type ThemeMode = "system" | "light" | "dark";

export function ThemeToggle() {
    const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();

    // theme puede ser undefined al inicio en algunos casos
    const mode = (theme ?? "system") as ThemeMode;

    // resolvedTheme ya te dice "light" | "dark" luego de resolver system
    const effective = (resolvedTheme ?? systemTheme ?? "light") as "light" | "dark";

    const label = useMemo(() => {
        if (mode === "system") return `🖥️ System (${effective})`;
        if (mode === "dark") return "🌙 Dark";
        return "☀️ Light";
    }, [mode, effective]);

    const next = useMemo<ThemeMode>(() => {
        if (mode === "system") return "light";
        if (mode === "light") return "dark";
        return "system";
    }, [mode]);

    return (
        <button
            type="button"
            className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition"
            onClick={() => setTheme(next)}
            title="Cambiar tema: System → Light → Dark"
        >
            {label}
        </button>
    );
}
