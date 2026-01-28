// /shared/lib/auth/hardLogout.ts
import Cookies from 'js-cookie'
import {resetAllStores} from "@/shared/store/resetAllStore";

let isLoggingOut = false

export function hardLogout(options?: { redirect?: boolean; reason?: string }) {
    if (isLoggingOut) return
    isLoggingOut = true

    try {
        // 1) storage
        // if (typeof window !== 'undefined') {
        //     localStorage.clear()
        //     sessionStorage.clear()
        // }

        // 2) cookies (Limpiar cookies)
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
        });

        // 3) zustand stores limpiar
        resetAllStores()

        // 4) redirect
        const redirect = options?.redirect ?? true
        if (redirect && typeof window !== 'undefined') {
            if (window.location.pathname !== '/login') {
                window.location.replace('/login')
            }
        }
    } finally {
        // permite otro logout si vuelve a ocurrir
        isLoggingOut = false
    }
}
