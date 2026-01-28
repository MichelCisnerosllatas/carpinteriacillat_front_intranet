// widgets/header/ui/Header.tsx
// widgets/header/ui/Header.tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { setCollapsed } from '@/shared/lib/theme'
import { useAuthStore } from '@/shared/store/auth/authStore'
import swal from '@/shared/lib/sweetalert2/sweetalert'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { toast } from "react-hot-toast"
import {hardLogout} from "@/shared/lib/auth/hardLogout";

const TITLE: Record<string,string> = {
    '/dashboard':'Dashboard',
    '/user':'Usuario',
}

export default function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
    const router = useRouter()
    const pathname = usePathname()
    const title = TITLE[pathname] ?? 'Panel'
    const [open, setOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)
    const { cerrarSesion, usuario } = useAuthStore()

    // const handleLogout = async () => {
    //     const result = await swal.confirm({
    //         title: '¿Cerrar sesión?',
    //         confirmText: 'Sí',
    //         cancelText: 'No',
    //         reverseButtons: true,
    //     })
    //
    //     if (result.isConfirmed) {
    //         router.push('/login')
    //         cerrarSesion()
    //         toast.success("Sesión cerrada")
    //     }
    // }

    const handleLogout = async () => {
        const res = await swal.confirmAsync({
            title: '¿Cerrar sesión?',
            confirmText: 'Sí',
            cancelText: 'No',
            loadingText: 'Cerrando...',
            onConfirm: async ({ update }) => {
                update({ text: 'Cerrando sesión, espera un momento...' })
                let ok = false
                try {
                    ok = await cerrarSesion() // backend (cuando lo implementes)
                } finally {
                    // ✅ SIEMPRE limpia local
                    hardLogout({ redirect: true, reason: ok ? 'manual' : 'manual_backend_failed' })
                }

                return true
            },
        })
        // const res = await swal.confirmAsync({
        //     title: '¿Cerrar sesión?',
        //     confirmText: 'Sí',
        //     cancelText: 'No',
        //     loadingText: 'Cerrando...',
        //
        //     onConfirm: async ({ update }) => {
        //         update({ text: 'Cerrando sesión, espera un momento...' })
        //
        //         await cerrarSesion() // ✅ tu request al backend
        //         hardLogout();
        //
        //         return true
        //     },
        // })
        //
        // if (res.ok) {
        //     router.push('/login')
        //     toast.success('Sesión cerrada')
        // }
    }


    React.useEffect(() => {
        const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
        const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
        window.addEventListener('click', onClick)
        window.addEventListener('keydown', onEsc)
        return () => { window.removeEventListener('click', onClick); window.removeEventListener('keydown', onEsc) }
    }, [])

    React.useEffect(() => { setOpen(false) }, [pathname])

    const nombre = usuario?.user?.person?.person_name || 'Usuario'
    const rol = usuario?.user?.role?.role_name || 'Invitado'
    const foto = null
    const iniciales = nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

    return (
        <header className="header px-4 flex items-center justify-between bg-bg text-fg border-b border-border">
            <div className="flex items-center gap-3">
                <button
                    className="cursor-pointer p-2 rounded-lg hover-fill"
                    aria-label="Menú"
                    onClick={() => { if (window.innerWidth < 1024) onOpenMobile(); else setCollapsed(); }}
                >
                    <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                <div>
                    <div className="text-sm md:text-base font-semibold">Sistema Intranet</div>
                    <div className="text-[12px] text-muted">{title}</div>
                </div>
            </div>

            <div className="relative" ref={ref}>
                <button
                    className="flex items-center gap-3 p-2 rounded-lg hover-fill"
                    onClick={() => setOpen(v => !v)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                >
                    {foto ? (
                        <Image
                            src={foto}
                            alt={nombre}
                            width={30}
                            height={30}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary grid place-items-center text-primary-fg text-xs font-semibold">
                            {iniciales}
                        </div>
                    )}

                    <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium">{nombre}</div>
                        <div className="text-[12px] text-muted">{rol}</div>
                    </div>

                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>

                {open && (
                    <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-bg text-fg shadow-xl p-2 z-[200]">
                        <Link href="/perfil" className="block px-3 py-2 rounded-lg hover-fill" role="menuitem" onClick={() => setOpen(false)}>
                            Mi Perfil
                        </Link>
                        <Link href="/theme" className="block px-3 py-2 rounded-lg hover-fill" role="menuitem" onClick={() => setOpen(false)}>
                            Cambiar Tema
                        </Link>
                        <button
                            onClick={() => { setOpen(false); handleLogout() }}
                            className="w-full text-left px-3 py-2 rounded-lg hover-fill text-red-600"
                            role="menuitem"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

// 'use client'
// import * as React from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { setCollapsed, clientLogout } from '@/shared/lib/theme'
// import { useAuthStore } from '@/shared/store/auth/authStore'
// import swal from '@/shared/lib/sweetalert2/sweetalert';
// import { useRouter } from 'next/navigation'
// import Image from "next/image";
// import {toast} from "react-hot-toast";
//
// const TITLE: Record<string,string> = {
//     '/dashboard':'Dashboard',
//     '/horarioacademico':'Horario Acádemico',
//     '/disponibilidadhoraria':'Disponibilidad Horaria',
//     '/proyectos':'Proyectos',
//     '/detalleperiodo':'Detalle del Período',
//
//     '/horarioacademico/tipohorario/automatico' : "Configurar automatico",
//
//     '/configuracion/facultad':'Facultad',
//     '/horarioacademico/configuracioncurso': 'Configuracion del Curso',
//     '/configuracion/tipos_periodo':'Tipos de Período',
//     '/reportes':'Reportes',
//     '/recursos':'Recursos',
//     '/ayuda':'Ayuda',
//     '/perfil':'Mi Perfil',
//     '/configuracion':'Configuración',
//     '/configuracion/aula':'Aula',
//     '/configuracion/docente' : 'Docente',
//     '/configuracion/usuario' : 'Usuario',
//     '/configuracion/curso' : 'Curso',
//     '/configuracion/user_groups': 'Rol',
//     '/configuracion/tema' : 'Tema',
// }
//
//
// export default function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
//     const router = useRouter();
//     const pathname = usePathname()
//     const title = TITLE[pathname] ?? 'Panel'
//     const [open, setOpen] = React.useState(false)
//     const ref = React.useRef<HTMLDivElement>(null)
//     const { cerrarSesion, usuario } = useAuthStore()
//
//     const handleLogout =  async () => {
//         const result = await swal.confirm({
//             title: '¿Cerrar sesión?',
//             confirmText: 'Sí',
//             cancelText: 'No',
//             reverseButtons: true, // ← aquí
//         })
//
//         if (result.isConfirmed) {
//             router.push('/login')
//             cerrarSesion()
//             // swal.success('Sesión cerrada', 'Hasta pronto 👋', 1000);
//             toast.success("Sesión cerrada");
//
//         }
//     }
//
//
//     React.useEffect(() => {
//         const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
//         const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
//         window.addEventListener('click', onClick)
//         window.addEventListener('keydown', onEsc)
//         return () => { window.removeEventListener('click', onClick); window.removeEventListener('keydown', onEsc) }
//     }, [])
//
//
//     React.useEffect(() => { setOpen(false) }, [pathname])
//
//     // 🧠 Datos del usuario (fallbacks por si está vacío)
//     const nombre = usuario?.data?.name || 'Usuario'
//     const rol = usuario?.data?.email || 'Invitado'
//     // const foto = usuario?.RutaImagen || null
//     const foto =  null;
//     const iniciales = nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
//
//     return (
//         <header className="header border-b border-app px-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//                 <button className="cursor-pointer p-2 rounded-lg hover-fill" aria-label="Menú" onClick={() => { if (window.innerWidth < 1024) onOpenMobile(); else setCollapsed(); }}>
//                     <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
//                 </button>
//                 <div>
//                     <div className="text-sm md:text-base font-semibold">Sistema Intranet</div>
//                     <div className="text-[12px] text-muted">{title}</div>
//                 </div>
//             </div>
//
//
//             <div className="relative" ref={ref}>
//                 <button
//                     className="flex items-center gap-3 p-2 rounded-lg hover-fill"
//                     onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>
//                     {foto ? (
//                         <Image
//                             src={foto}
//                             alt={nombre}
//                             width={30}
//                             height={30}
//                             className="w-8 h-8 rounded-full object-cover"
//                         />
//                     ) : (
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center text-white text-xs font-semibold">
//                             {iniciales}
//                         </div>
//                     )}
//                     <div className="hidden sm:block text-left">
//                         <div className="text-sm font-medium">{nombre}</div>
//                         <div className="text-[12px] text-muted">{rol}</div>
//                     </div>
//                     <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
//                 </button>
//
//
//                 {open && (
//                     <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-app bg-app shadow-xl p-2 z-[200]">
//                         <Link href="/perfil" className="block px-3 py-2 rounded-lg hover-fill" role="menuitem" onClick={() => setOpen(false)}>Mi Perfil</Link>
//                         <Link href="/configuracion" className="block px-3 py-2 rounded-lg hover-fill" role="menuitem" onClick={() => setOpen(false)}>Configuración</Link>
//                         <button
//                             onClick={() => {
//                                 setOpen(false);
//                                 handleLogout();
//                             }}
//                             className="w-full text-left px-3 py-2 rounded-lg hover-fill text-red-600"
//                             role="menuitem">
//                             Cerrar sesión
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </header>
//     )
// }