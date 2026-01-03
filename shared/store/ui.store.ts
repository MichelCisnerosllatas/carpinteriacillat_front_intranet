//shared/store/ui.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type BrandTheme = "blue" | "green" | "amber" | "rose";

type UIState = {
    brand: BrandTheme;
    setBrand: (b: BrandTheme) => void;
};

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            brand: "amber",
            setBrand: (brand) => set({ brand }),
        }),
        { name: "ui-preferences" }
    )
);
