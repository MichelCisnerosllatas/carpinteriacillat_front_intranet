//features/auth/storage/auth.storage.ts
import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'
export const tokenStorage = {
    /* ===== LOCAL STORAGE ===== */
    getLocal: (): string | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(TOKEN_KEY)
    },

    setLocal: (token: string) => {
        if (typeof window === 'undefined') return
        localStorage.setItem(TOKEN_KEY, token)
    },

    removeLocal: () => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(TOKEN_KEY)
    },

    /* ===== COOKIES ===== */
    getCookies: (): string | null => {
        return Cookies.get(TOKEN_KEY) ?? null
    },

    setCookies: (token: string) => {
        Cookies.set(TOKEN_KEY, token)
    },

    removeCookies: () => {
        Cookies.remove(TOKEN_KEY)
    },

    /* ===== GENÉRICO (lo que usa el resto) ===== */
    get: (): string | null => {
        return (
            tokenStorage.getCookies() ||
            tokenStorage.getLocal()
        )
    },

    set: (token: string) => {
        tokenStorage.setCookies(token)
        tokenStorage.setLocal(token)
    },

    remove: () => {
        tokenStorage.removeCookies()
        tokenStorage.removeLocal()
    },
}
