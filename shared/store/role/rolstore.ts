// src/shared/store/auth/useRolStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface RolState {
    idRol: number | null
    setIdRol: (rol: number | null) => void
    syncWithCookies: () => void
}

export const useRolStore = create<RolState>()(
    persist(
        (set) => ({
            idRol: null,

            setIdRol: (rol) => set({ idRol: rol }),

            // Sincroniza automáticamente el rol desde la cookie "user"
            syncWithCookies: () => {
                const cookie = Cookies.get('user')
                if (cookie) {
                    try {
                        const user = JSON.parse(cookie)
                        const newRol = Number(user.idrol)
                        set((state) => {
                            // solo cambia si es distinto (para evitar re-render inútil)
                            if (state.idRol !== newRol) return { idRol: newRol }
                            return state
                        })
                    } catch {
                        set({ idRol: null })
                    }
                } else {
                    set({ idRol: null })
                }
            },
        }),
        {
            name: 'rol-storage',
            skipHydration: true, // evita parpadeo durante la carga
        }
    )
)
