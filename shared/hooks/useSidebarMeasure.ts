// src/shared/hooks/useSidebarMeasure.ts
import { useEffect } from "react";
import { useSidebarUiStore } from "@/shared/store/intranet/sidebarUiStore";

export function useSidebarMeasure(ref: React.RefObject<HTMLElement | null>) {
    const setSidebarWidth = useSidebarUiStore((s) => s.setSidebarWidth);
    const setCollapsed = useSidebarUiStore((s) => s.setCollapsed);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const updateCollapsed = () => {
            const isCollapsed = document.documentElement.classList.contains("sidebar-collapsed");
            const isDesktop = window.matchMedia?.("(min-width: 1024px)")?.matches ?? true;
            setCollapsed(isCollapsed && isDesktop);
        };

        updateCollapsed();

        // 1) width live
        const ro = new ResizeObserver(() => {
            const w = Math.round(el.getBoundingClientRect().width);
            setSidebarWidth(w);
        });
        ro.observe(el);

        // 2) collapsed live
        const mo = new MutationObserver(updateCollapsed);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        // 3) desktop/mobile changes
        const onResize = () => updateCollapsed();
        window.addEventListener("resize", onResize);

        // init width now
        setSidebarWidth(Math.round(el.getBoundingClientRect().width));

        return () => {
            ro.disconnect();
            mo.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [ref, setSidebarWidth, setCollapsed]);
}
