// src/shared/lib/theme.ts
export type Theme = 'system' | 'light' | 'dark'
const THEME_KEY = 'theme'
let mq: MediaQueryList | null = null


function applyClassFor(theme: Theme){
    const el = document.documentElement
    el.classList.remove('dark')
    if (theme === 'system'){
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) el.classList.add('dark')
    } else if (theme === 'dark') {
        el.classList.add('dark')
    }
}


export function setTheme(theme: Theme){
    localStorage.setItem(THEME_KEY, theme)
    try { localStorage.removeItem('darkMode') } catch {}
    applyClassFor(theme)
}
export function getTheme(): Theme {
    const t = localStorage.getItem(THEME_KEY) as Theme | null
    if (t) return t
    const dm = localStorage.getItem('darkMode')
    if (dm !== null) { try { return JSON.parse(dm) ? 'dark' : 'light' } catch { return dm==='true' ? 'dark' : 'light' } }
    return 'light'
}


// export function setCollapsed(next?: boolean) {
//     if (typeof window === 'undefined') return
//
//     const root = document.querySelector('[data-intranet]') as HTMLElement | null
//     if (!root) return
//
//     const current = root.getAttribute('data-collapsed') === 'true'
//     const want = typeof next === 'boolean' ? next : !current
//
//     root.setAttribute('data-collapsed', want ? 'true' : 'false')
//
//     // Persistencia (cookie para SSR + localStorage opcional)
//     document.cookie = `sidebarCollapsed=${want ? '1' : '0'}; path=/; max-age=31536000; samesite=lax`
//     try { localStorage.setItem('sidebarCollapsed', String(want)) } catch {}
//
// }
// src/shared/lib/theme.ts
export function setCollapsed(next?: boolean) {
    if (typeof window === "undefined") return;

    const root = document.querySelector("[data-intranet]") as HTMLElement | null;
    if (!root) return;

    const current = root.getAttribute("data-collapsed") === "true";
    const want = typeof next === "boolean" ? next : !current;

    root.setAttribute("data-collapsed", want ? "true" : "false");

    // Persistencia (SSR + client)
    document.cookie = `sidebarCollapsed=${want ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
    try { localStorage.setItem("sidebarCollapsed", String(want)); } catch {}

    // ✅ importante: avisar al sidebar/tooltip sin hacks
    window.dispatchEvent(new CustomEvent("intranet:collapsed", { detail: { collapsed: want } }));
}



export function clientLogout(){
    try { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); } catch {}
    window.location.href = '/login'
}

