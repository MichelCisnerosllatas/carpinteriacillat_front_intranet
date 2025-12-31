"use client";

import { useEffect } from "react";
import { useUIStore } from "@/shared/store/ui.store";

const BRAND: Record<string, { primary: string; primaryFg: string }> = {
    blue:  { primary: "221 83% 53%", primaryFg: "210 40% 98%" },
    green: { primary: "142 71% 45%", primaryFg: "210 40% 98%" },
    amber: { primary: "38 92% 50%",  primaryFg: "222 47% 11%" },
    rose:  { primary: "346 77% 49%", primaryFg: "210 40% 98%" },
};

export function BrandThemeSync() {
    const brand = useUIStore((s) => s.brand);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--primary", BRAND[brand].primary);
        root.style.setProperty("--primary-fg", BRAND[brand].primaryFg);
    }, [brand]);

    return null;
}
