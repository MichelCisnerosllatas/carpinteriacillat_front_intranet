"use client";

import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { useUIStore } from "@/shared/store/ui.store";

type ThemeMode = "system" | "light" | "dark";
type BrandTheme = "blue" | "green" | "amber" | "rose";

export default function ThemeOptionsElegant() {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const mode = (theme ?? "system") as ThemeMode;

    const brand = useUIStore((s) => s.brand);
    const setBrand = useUIStore((s) => s.setBrand);

    const modes: { key: ThemeMode; label: string }[] = [
        { key: "system", label: "System" },
        { key: "light", label: "Light" },
        { key: "dark", label: "Dark" },
    ];

    const brands: { key: BrandTheme; label: string }[] = [
        { key: "blue", label: "Blue" },
        { key: "green", label: "Green" },
        { key: "amber", label: "Amber" },
        { key: "rose", label: "Rose" },
    ];

    const subtitle = useMemo(() => {
        const m = modes.find((x) => x.key === mode)?.label ?? "System";
        const b = brands.find((x) => x.key === brand)?.label ?? "Blue";
        return `${m} • ${b}`;
    }, [mode, brand]);

    return (
        <>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-surface hover:bg-surface-2 transition"
            >
                <span className="text-sm font-medium">Theme</span>
                <span className="text-xs text-muted-fg">{subtitle}</span>
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* backdrop */}
                    <button
                        aria-label="Close"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative w-[92%] max-w-xl rounded-2xl border border-border bg-surface shadow-xl">
                        <div className="p-5 border-b border-border">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-fg">
                                        Theme opciones elegantes
                                    </h2>
                                    <p className="text-sm text-muted-fg mt-1">
                                        Elige modo de apariencia y color de marca.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-2 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Mode */}
                            <section className="space-y-2">
                                <div className="text-sm font-medium text-fg">Modo</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {modes.map((m) => (
                                        <button
                                            key={m.key}
                                            type="button"
                                            onClick={() => setTheme(m.key)}
                                            className={[
                                                "px-3 py-3 rounded-xl border transition text-sm",
                                                "border-border bg-surface hover:bg-surface-2",
                                                mode === m.key ? "ring-2 ring-primary" : "",
                                            ].join(" ")}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Brand */}
                            <section className="space-y-2">
                                <div className="text-sm font-medium text-fg">Color de marca</div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {brands.map((b) => (
                                        <button
                                            key={b.key}
                                            type="button"
                                            onClick={() => setBrand(b.key)}
                                            className={[
                                                "px-3 py-3 rounded-xl border transition text-sm",
                                                "border-border bg-surface hover:bg-surface-2",
                                                brand === b.key ? "ring-2 ring-primary" : "",
                                            ].join(" ")}
                                        >
                                            {b.label}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Preview */}
                            <section className="rounded-2xl border border-border bg-surface-2 p-4">
                                <div className="text-sm font-medium text-fg">Preview</div>
                                <p className="text-sm text-muted-fg mt-1">
                                    Fondo: <span className="font-medium text-fg">bg</span> •
                                    Contenedor: <span className="font-medium text-fg">surface</span> •
                                    Elevado: <span className="font-medium text-fg">surface-2</span>
                                </p>

                                <div className="mt-4 flex gap-3 flex-wrap">
                                    <button className="px-4 py-2 rounded-xl bg-primary text-primary-fg">
                                        Botón primario
                                    </button>
                                    <button className="px-4 py-2 rounded-xl border border-border bg-surface">
                                        Secundario
                                    </button>
                                </div>
                            </section>
                        </div>

                        <div className="p-5 border-t border-border flex justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-fg"
                            >
                                Listo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
