// widgets/intranet/sidebar/ui/Sidebar.tsx
// widgets/intranet/sidebar/ui/Sidebar.tsx
'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Home, Users, Calendar, FileText, Settings, HelpCircle, School, ChevronDown, X } from 'lucide-react'
import Tooltip from '@/widget/intranet/ToolTip'
import { useRolStore } from '@/shared/store/role/rolstore'

type MenuItem = {
    id: string
    label: string
    Icon: any
    href?: string
    children?: MenuItem[]
}
type MenuSection = { title: string; items: MenuItem[] }

const MENU: MenuSection[] = [
    {
        title: 'Principal',
        items: [
            { id: 'dashboard', href: '/dashboard', label: 'Dashboard', Icon: Home },
            {
                id: 'academico',
                label: 'Académico',
                Icon: School,
                children: [
                    { id: 'horarioacademico', href: '/horarioacademico', label: 'Horario Académico', Icon: Calendar },
                    { id: 'disponibilidadhoraria', href: '/disponibilidadhoraria', label: 'Disponibilidad Horaria', Icon: Users },
                    { id: 'periodos_gestion', href: '/periodos_gestion', label: 'Período', Icon: FileText },
                ],
            },
        ],
    },
    {
        title: 'Configuración',
        items: [
            { id: 'configuracion', href: '/configuracion', label: 'Configuración', Icon: Settings },
            { id: 'ayuda', href: '/ayuda', label: 'Ayuda', Icon: HelpCircle },
        ],
    },
]

const PERMISOS_ROLES: Record<number, string[]> = {
    1: MENU.flatMap(s => s.items.flatMap(i => [i.id, ...(i.children?.map(c => c.id) ?? [])])),
    4: ['disponibilidadhoraria'],
    3: ['dashboard', 'horarioacademico', 'facultad', 'reportes'],
}

interface SidebarProps {
    mobileOpen: boolean
    onCloseMobile: () => void
}

function readCollapsed() {
    const root = document.querySelector('[data-intranet]') as HTMLElement | null
    return root?.getAttribute('data-collapsed') === 'true'
}
function isDesktop() {
    return window.matchMedia?.('(min-width: 1024px)')?.matches ?? true
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
    const pathname = usePathname()
    const { idRol, syncWithCookies } = useRolStore()

    const [collapsed, setCollapsedState] = useState(false)
    const [openGroup, setOpenGroup] = useState<string | null>(null)

    const [popover, setPopover] = useState<{
        item: MenuItem
        top: number
        left: number
    } | null>(null)

    useEffect(() => {
        syncWithCookies()
        const interval = setInterval(() => syncWithCookies(), 1000)
        return () => clearInterval(interval)
    }, [syncWithCookies])

    useEffect(() => {
        const update = () => setCollapsedState(readCollapsed() && isDesktop())
        update()

        const root = document.querySelector('[data-intranet]') as HTMLElement | null
        if (!root) return

        const mo = new MutationObserver(update)
        mo.observe(root, { attributes: true, attributeFilter: ['data-collapsed'] })

        const onEvt = () => update()
        window.addEventListener('intranet:collapsed', onEvt)

        const onResize = () => update()
        window.addEventListener('resize', onResize)

        return () => {
            mo.disconnect()
            window.removeEventListener('intranet:collapsed', onEvt)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    const isActive = (href?: string) => !!href && (pathname === href || pathname.startsWith(href + '/'))

    const visibleMenu = useMemo(() => {
        if (!idRol) return []
        const permisos = new Set(PERMISOS_ROLES[idRol] ?? [])

        const mapItem = (item: MenuItem): MenuItem | null => {
            if (!item.children?.length) return permisos.has(item.id) ? item : null
            const children = item.children.map(mapItem).filter(Boolean) as MenuItem[]
            if (!children.length && !permisos.has(item.id)) return null
            return { ...item, children }
        }

        return MENU.map(section => {
            const items = section.items.map(mapItem).filter(Boolean) as MenuItem[]
            return { ...section, items }
        }).filter(s => s.items.length > 0)
    }, [idRol])

    useEffect(() => {
        if (collapsed) return
        for (const section of visibleMenu) {
            for (const item of section.items) {
                if (item.children?.length && item.children.some(c => isActive(c.href))) {
                    setOpenGroup(item.id)
                    return
                }
            }
        }
    }, [pathname, collapsed, visibleMenu])

    useEffect(() => { setPopover(null) }, [pathname])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPopover(null) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const openPopoverAt = (btn: HTMLElement, item: MenuItem) => {
        const r = btn.getBoundingClientRect()
        setPopover({
            item,
            top: r.top + r.height / 2,
            left: r.right + 10,
        })
    }

    return (
        <>
            <div className={`overlay lg:hidden ${mobileOpen ? 'show' : ''}`} onClick={onCloseMobile} />

            <aside className={`sidebar ${mobileOpen ? 'show' : ''} bg-bg text-fg border-r border-border`}>
                <div className="sticky top-0 h-14 flex items-center px-3 border-b border-border bg-bg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 grid place-items-center">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXKlrYav_oYo_B4d5NHCW1LFFibw4RqtuEzA&s"
                                alt="UNAP logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="label text-sm font-semibold">Intranet</span>
                    </div>

                    <button
                        className="ml-auto p-2 rounded-lg hover-fill lg:hidden cursor-pointer"
                        aria-label="Cerrar"
                        onClick={onCloseMobile}
                    >
                        <X className="w-5 h-5 text-muted cursor-pointer" />
                    </button>
                </div>

                <nav className="p-3 space-y-6 transition-opacity duration-300" style={{ opacity: idRol ? 1 : 0.4 }}>
                    {visibleMenu.map(section => (
                        <div key={section.title}>
                            <div className="label px-2 text-[11px] uppercase tracking-wider text-muted mb-2">
                                {section.title}
                            </div>

                            {section.items.map(item => {
                                const hasChildren = !!item.children?.length

                                if (hasChildren) {
                                    const anyChildActive = item.children!.some(c => isActive(c.href))
                                    const opened = openGroup === item.id

                                    return (
                                        <div key={item.id} className="relative">
                                            <button
                                                type="button"
                                                className={`navlink relative w-full ${anyChildActive ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    const btn = e.currentTarget as HTMLElement
                                                    if (collapsed) {
                                                        openPopoverAt(btn, item)
                                                        return
                                                    }
                                                    setOpenGroup(opened ? null : item.id)
                                                }}
                                            >
                                                <item.Icon className="icon" />
                                                <span className="label">{item.label}</span>

                                                {!collapsed && (
                                                    <ChevronDown className={`ml-auto h-4 w-4 transition ${opened ? 'rotate-180' : ''}`} />
                                                )}

                                                {collapsed && <Tooltip label={item.label} />}
                                            </button>

                                            {!collapsed && opened && (
                                                <div className="ml-8 mt-1 space-y-1">
                                                    {item.children!.map(child => {
                                                        const activeChild = isActive(child.href)
                                                        return (
                                                            <Link
                                                                key={child.id}
                                                                href={child.href!}
                                                                className={`navlink relative ${activeChild ? 'active' : ''}`}
                                                                onClick={() => onCloseMobile()}
                                                            >
                                                                <child.Icon className="icon" />
                                                                <span className="label">{child.label}</span>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                const active = isActive(item.href)
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href!}
                                        className={`navlink relative ${active ? 'active' : ''}`}
                                        onClick={(e) => {
                                            if (active) e.preventDefault()
                                            else onCloseMobile()
                                        }}
                                    >
                                        <item.Icon className="icon" />
                                        <span className="label">{item.label}</span>
                                        {collapsed && <Tooltip label={item.label} />}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>
            </aside>

            {collapsed && popover?.item?.children?.length ? (
                <div className="intra-popover-overlay" onClick={() => setPopover(null)}>
                    <div
                        className="intra-popover"
                        role="dialog"
                        aria-modal="true"
                        style={{
                            position: 'fixed',
                            top: popover.top,
                            left: popover.left,
                            transform: 'translateY(-50%)',
                            zIndex: 9999,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="intra-popover-arrow" />

                        <div className="intra-popover-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <popover.item.Icon className="icon" style={{ width: 18, height: 18 }} />
                                <div style={{ fontWeight: 700 }}>{popover.item.label}</div>
                            </div>

                            <button className="intra-popover-close" onClick={() => setPopover(null)} aria-label="Cerrar">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="intra-popover-list">
                            {popover.item.children.map(child => {
                                const activeChild = isActive(child.href)
                                return (
                                    <Link
                                        key={child.id}
                                        href={child.href!}
                                        className={`intra-popover-item ${activeChild ? 'active' : ''}`}
                                        onClick={() => setPopover(null)}
                                    >
                                        <child.Icon className="icon" />
                                        <span className="label">{child.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}


// 'use client'
//
// import Link from 'next/link'
// import React, { useEffect, useMemo, useRef, useState } from 'react'
// import { usePathname } from 'next/navigation'
// import { Home, Users, Calendar, FileText, Settings, HelpCircle, School, ChevronDown, X } from 'lucide-react'
// import Tooltip from '@/widget/intranet/ToolTip'
// import { useRolStore } from '@/shared/store/role/rolstore'
//
// type MenuItem = {
//     id: string
//     label: string
//     Icon: any
//     href?: string
//     children?: MenuItem[]
// }
// type MenuSection = { title: string; items: MenuItem[] }
//
// const MENU: MenuSection[] = [
//     {
//         title: 'Principal',
//         items: [
//             { id: 'dashboard', href: '/dashboard', label: 'Dashboard', Icon: Home },
//             {
//                 id: 'academico',
//                 label: 'Académico',
//                 Icon: School,
//                 children: [
//                     { id: 'horarioacademico', href: '/horarioacademico', label: 'Horario Académico', Icon: Calendar },
//                     { id: 'disponibilidadhoraria', href: '/disponibilidadhoraria', label: 'Disponibilidad Horaria', Icon: Users },
//                     { id: 'periodos_gestion', href: '/periodos_gestion', label: 'Período', Icon: FileText },
//                 ],
//             },
//         ],
//     },
//     {
//         title: 'Configuración',
//         items: [
//             { id: 'configuracion', href: '/configuracion', label: 'Configuración', Icon: Settings },
//             { id: 'ayuda', href: '/ayuda', label: 'Ayuda', Icon: HelpCircle },
//         ],
//     },
// ]
//
// const PERMISOS_ROLES: Record<number, string[]> = {
//     1: MENU.flatMap(s => s.items.flatMap(i => [i.id, ...(i.children?.map(c => c.id) ?? [])])),
//     4: ['disponibilidadhoraria'],
//     3: ['dashboard', 'horarioacademico', 'facultad', 'reportes'],
// }
//
// interface SidebarProps {
//     mobileOpen: boolean
//     onCloseMobile: () => void
// }
//
// function readCollapsed() {
//     const root = document.querySelector('[data-intranet]') as HTMLElement | null
//     return root?.getAttribute('data-collapsed') === 'true'
// }
// function isDesktop() {
//     return window.matchMedia?.('(min-width: 1024px)')?.matches ?? true
// }
//
// export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
//     const pathname = usePathname()
//     const { idRol, syncWithCookies } = useRolStore()
//
//     const [collapsed, setCollapsedState] = useState(false)
//     const [openGroup, setOpenGroup] = useState<string | null>(null)
//
//     // popover pegado al item
//     const [popover, setPopover] = useState<{
//         item: MenuItem
//         top: number
//         left: number
//     } | null>(null)
//
//     // Sync rol
//     useEffect(() => {
//         syncWithCookies()
//         const interval = setInterval(() => syncWithCookies(), 1000)
//         return () => clearInterval(interval)
//     }, [syncWithCookies])
//
//     // ✅ escuchar colapsado por atributo + evento
//     useEffect(() => {
//         const update = () => setCollapsedState(readCollapsed() && isDesktop())
//         update()
//
//         const root = document.querySelector('[data-intranet]') as HTMLElement | null
//         if (!root) return
//
//         const mo = new MutationObserver(update)
//         mo.observe(root, { attributes: true, attributeFilter: ['data-collapsed'] })
//
//         const onEvt = () => update()
//         window.addEventListener('intranet:collapsed', onEvt)
//
//         const onResize = () => update()
//         window.addEventListener('resize', onResize)
//
//         return () => {
//             mo.disconnect()
//             window.removeEventListener('intranet:collapsed', onEvt)
//             window.removeEventListener('resize', onResize)
//         }
//     }, [])
//
//     const isActive = (href?: string) => !!href && (pathname === href || pathname.startsWith(href + '/'))
//
//     const visibleMenu = useMemo(() => {
//         if (!idRol) return []
//         const permisos = new Set(PERMISOS_ROLES[idRol] ?? [])
//
//         const mapItem = (item: MenuItem): MenuItem | null => {
//             if (!item.children?.length) return permisos.has(item.id) ? item : null
//             const children = item.children.map(mapItem).filter(Boolean) as MenuItem[]
//             if (!children.length && !permisos.has(item.id)) return null
//             return { ...item, children }
//         }
//
//         return MENU.map(section => {
//             const items = section.items.map(mapItem).filter(Boolean) as MenuItem[]
//             return { ...section, items }
//         }).filter(s => s.items.length > 0)
//     }, [idRol])
//
//     // Auto abrir grupo si un child está activo (solo expandido)
//     useEffect(() => {
//         if (collapsed) return
//         for (const section of visibleMenu) {
//             for (const item of section.items) {
//                 if (item.children?.length && item.children.some(c => isActive(c.href))) {
//                     setOpenGroup(item.id)
//                     return
//                 }
//             }
//         }
//     }, [pathname, collapsed, visibleMenu])
//
//     // Cerrar popover al navegar
//     useEffect(() => { setPopover(null) }, [pathname])
//
//     // cerrar popover con ESC
//     useEffect(() => {
//         const onKey = (e: KeyboardEvent) => {
//             if (e.key === 'Escape') setPopover(null)
//         }
//         window.addEventListener('keydown', onKey)
//         return () => window.removeEventListener('keydown', onKey)
//     }, [])
//
//     const openPopoverAt = (btn: HTMLElement, item: MenuItem) => {
//         const r = btn.getBoundingClientRect()
//         setPopover({
//             item,
//             top: r.top + r.height / 2,
//             left: r.right + 10, // pegado al sidebar
//         })
//     }
//
//     return (
//         <>
//             <div className={`overlay lg:hidden ${mobileOpen ? 'show' : ''}`} onClick={onCloseMobile} />
//
//             <aside className={`sidebar ${mobileOpen ? 'show' : ''}`}>
//                 {/* HEADER (no lo quito) */}
//                 <div className="sticky top-0 h-14 flex items-center px-3 border-b border-border bg-bg">
//                     <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 grid place-items-center">
//                             <img
//                                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXKlrYav_oYo_B4d5NHCW1LFFibw4RqtuEzA&s"
//                                 alt="UNAP logo"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                         <span className="label text-sm font-semibold">Intranet</span>
//                     </div>
//
//                     <button
//                         className="ml-auto p-2 rounded-lg hover-fill lg:hidden cursor-pointer"
//                         aria-label="Cerrar"
//                         onClick={onCloseMobile}
//                     >
//                         <X className="w-5 h-5 text-muted cursor-pointer" />
//                     </button>
//                 </div>
//
//                 <nav className="p-3 space-y-6 transition-opacity duration-300" style={{ opacity: idRol ? 1 : 0.4 }}>
//                     {visibleMenu.map(section => (
//                         <div key={section.title}>
//                             <div className="label px-2 text-[11px] uppercase tracking-wider text-muted mb-2">
//                                 {section.title}
//                             </div>
//
//                             {section.items.map(item => {
//                                 const hasChildren = !!item.children?.length
//
//                                 // ========== CON CHILDREN ==========
//                                 if (hasChildren) {
//                                     const anyChildActive = item.children!.some(c => isActive(c.href))
//                                     const opened = openGroup === item.id
//
//                                     return (
//                                         <div key={item.id} className="relative">
//                                             <button
//                                                 type="button"
//                                                 className={`navlink relative w-full ${anyChildActive ? 'active' : ''}`}
//                                                 onClick={(e) => {
//                                                     const btn = e.currentTarget as HTMLElement
//
//                                                     if (collapsed) {
//                                                         openPopoverAt(btn, item)
//                                                         return
//                                                     }
//
//                                                     setOpenGroup(opened ? null : item.id)
//                                                 }}
//                                             >
//                                                 <item.Icon className="icon" />
//                                                 <span className="label">{item.label}</span>
//
//                                                 {!collapsed && (
//                                                     <ChevronDown className={`ml-auto h-4 w-4 transition ${opened ? 'rotate-180' : ''}`} />
//                                                 )}
//
//                                                 {/* Tooltip solo colapsado */}
//                                                 {collapsed && <Tooltip label={item.label} />}
//                                             </button>
//
//                                             {/* children inline SOLO expandido */}
//                                             {!collapsed && opened && (
//                                                 <div className="ml-8 mt-1 space-y-1">
//                                                     {item.children!.map(child => {
//                                                         const activeChild = isActive(child.href)
//                                                         return (
//                                                             <Link
//                                                                 key={child.id}
//                                                                 href={child.href!}
//                                                                 className={`navlink relative ${activeChild ? 'active' : ''}`}
//                                                                 onClick={() => onCloseMobile()}
//                                                             >
//                                                                 <child.Icon className="icon" />
//                                                                 <span className="label">{child.label}</span>
//                                                             </Link>
//                                                         )
//                                                     })}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )
//                                 }
//
//                                 // ========== SIMPLE ==========
//                                 const active = isActive(item.href)
//                                 return (
//                                     <Link
//                                         key={item.id}
//                                         href={item.href!}
//                                         className={`navlink relative ${active ? 'active' : ''}`}
//                                         onClick={(e) => {
//                                             if (active) e.preventDefault()
//                                             else onCloseMobile()
//                                         }}
//                                     >
//                                         <item.Icon className="icon" />
//                                         <span className="label">{item.label}</span>
//                                         {collapsed && <Tooltip label={item.label} />}
//                                     </Link>
//                                 )
//                             })}
//                         </div>
//                     ))}
//                 </nav>
//             </aside>
//
//             {/* =================== POPOVER PEGADO (solo cuando colapsado) =================== */}
//             {collapsed && popover?.item?.children?.length ? (
//                 <div className="intra-popover-overlay" onClick={() => setPopover(null)}>
//                     <div
//                         className="intra-popover"
//                         role="dialog"
//                         aria-modal="true"
//                         style={{
//                             position: 'fixed',
//                             top: popover.top,
//                             left: popover.left,
//                             transform: 'translateY(-50%)',
//                             zIndex: 9999,
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <span className="intra-popover-arrow" />
//
//                         <div className="intra-popover-header">
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                                 <popover.item.Icon className="icon" style={{ width: 18, height: 18 }} />
//                                 <div style={{ fontWeight: 700 }}>{popover.item.label}</div>
//                             </div>
//
//                             <button className="intra-popover-close" onClick={() => setPopover(null)} aria-label="Cerrar">
//                                 <X className="w-4 h-4" />
//                             </button>
//                         </div>
//
//                         <div className="intra-popover-list">
//                             {popover.item.children.map(child => {
//                                 const activeChild = isActive(child.href)
//                                 return (
//                                     <Link
//                                         key={child.id}
//                                         href={child.href!}
//                                         className={`intra-popover-item ${activeChild ? 'active' : ''}`}
//                                         onClick={() => setPopover(null)}
//                                     >
//                                         <child.Icon className="icon" />
//                                         <span className="label">{child.label}</span>
//                                     </Link>
//                                 )
//                             })}
//                         </div>
//                     </div>
//                 </div>
//             ) : null}
//         </>
//     )
// }