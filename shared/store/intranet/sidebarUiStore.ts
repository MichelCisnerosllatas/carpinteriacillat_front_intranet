import { create } from "zustand";

type SidebarUiState = {
    sidebarWidth: number;
    collapsed: boolean;

    // dropdown
    openGroupId: string | null;

    setSidebarWidth: (w: number) => void;
    setCollapsed: (v: boolean) => void;

    toggleGroup: (id: string) => void;
    closeGroup: () => void;
};

export const useSidebarUiStore = create<SidebarUiState>((set, get) => ({
    sidebarWidth: 0,
    collapsed: false,

    openGroupId: null,

    setSidebarWidth: (w) => set({ sidebarWidth: w }),
    setCollapsed: (v) => set({ collapsed: v }),

    toggleGroup: (id) =>
        set({ openGroupId: get().openGroupId === id ? null : id }),

    closeGroup: () => set({ openGroupId: null }),
}));
