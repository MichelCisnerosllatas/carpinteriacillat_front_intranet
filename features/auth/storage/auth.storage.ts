//features/auth/storage/auth.storage.ts
import Cookies from 'js-cookie'

const AUTH_KEY = 'auth_storage'
export const authStorage = {
    /* ===== LOCAL STORAGE ===== */
    getLocal: (): string | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(AUTH_KEY)
    },

    setLocal: (token: string) => {
        if (typeof window === 'undefined') return
        localStorage.setItem(AUTH_KEY, token)
    },

    removeLocal: () => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(AUTH_KEY)
    },

    /* ===== COOKIES ===== */
    getCookies: (): string | null => {
        return Cookies.get(AUTH_KEY) ?? null
    },

    setCookies: (token: string) => {
        Cookies.set(AUTH_KEY, token)
    },

    removeCookies: () => {
        Cookies.remove(AUTH_KEY)
    },

    /* ===== GENÉRICO (lo que usa el resto) ===== */
    get: (): string | null => {
        return (
            authStorage.getCookies() ||
            authStorage.getLocal()
        )
    },

    set: (token: string) => {
        authStorage.setCookies(token)
        authStorage.setLocal(token)
    },

    remove: () => {
        authStorage.removeCookies()
        authStorage.removeLocal()
    },
}
