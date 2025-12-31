//app/theme/theme-page-client.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type ThemeMode = "system" | "light" | "dark";

function isThemeMode(v: unknown): v is ThemeMode {
    return v === "system" || v === "light" || v === "dark";
}

const THEMES: {
    value: ThemeMode;
    label: string;
    description: string;
    icon: ReactNode;
}[] = [
    {
        value: "system",
        label: "Sistema",
        description: "Usa el tema del sistema operativo",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                <rect x="2" y="3" width="18" height="12" rx="2" />
                <rect x="8" y="17" width="6" height="2" />
            </svg>
        ),
    },
    {
        value: "light",
        label: "Claro",
        description: "Tema claro permanente",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                <circle cx="11" cy="11" r="4" />
            </svg>
        ),
    },
    {
        value: "dark",
        label: "Oscuro",
        description: "Tema oscuro permanente",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                <path d="M15 11a4 4 0 1 1-4-4 5 5 0 0 0 4 4z" />
            </svg>
        ),
    },
];


export default function ThemePageClient() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);

    const current: ThemeMode = mounted && isThemeMode(theme) ? theme : "system";

    return (
        <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Apariencia</h2>
                <p className="text-sm text-muted-fg">
                    Selecciona el modo de visualización
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {THEMES.map((t) => {
                    const active = current === t.value;

                    return (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setTheme(t.value)}
                            className={[
                                "text-left rounded-2xl border p-4 transition",
                                "bg-surface-2 hover:bg-surface",
                                active ? "border-primary ring-2 ring-primary" : "border-border",
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-primary">{t.icon}</div>
                                <div>
                                    <div className="font-medium">{t.label}</div>
                                    <div className="text-xs text-muted-fg">{t.description}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

