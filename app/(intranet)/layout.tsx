// // app/(intranet)/layout.tsx (SERVER: sin 'use client')
import './intranet.css'
import { cookies } from 'next/headers'
import IntranetShell from './intranet-shell'

export default async function IntranetLayout({
 children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const collapsed = cookieStore.get('sidebarCollapsed')?.value === '1'

    return (
        <IntranetShell initialCollapsed={collapsed}>
            {children}
        </IntranetShell>
    )
}


// 'use client'
//
// import React, { useEffect, useState } from 'react'
// import Script from 'next/script'
// import Sidebar from '@/widget/intranet/Sidebar'
// import Header from '@/widget/intranet/Header'
// import './intranet.css'
// import { initCollapsedFromStorage } from '@/shared/lib/theme'
//
// export default function IntranetLayout({ children }: { children: React.ReactNode }) {
//     const [mobileOpen, setMobileOpen] = useState(false)
//
//     // ✅ opcional: para cuando cambias de tamaño (móvil/desktop)
//     useEffect(() => {
//         const mq = window.matchMedia('(min-width: 1024px)')
//         const onChange = () => initCollapsedFromStorage()
//         mq.addEventListener?.('change', onChange)
//         return () => mq.removeEventListener?.('change', onChange)
//     }, [])
//
//     return (
//         <>
//             {/* ✅ APLICAR ANTES DEL PRIMER PAINT (sin parpadeo) */}
//             <Script id="intranet-sidebar-collapsed" strategy="beforeInteractive">
//                 {`
//           (function () {
//             try {
//               var saved = localStorage.getItem('sidebarCollapsed');
//               if (saved == null) return;
//
//               // solo desktop
//               var isDesktop = window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
//               if (!isDesktop) return;
//
//               var html = document.documentElement;
//               html.classList.add('intra-preload');
//               requestAnimationFrame(function(){ html.classList.remove('intra-preload'); });
//               if (saved === 'true') html.classList.add('sidebar-collapsed');
//               else html.classList.remove('sidebar-collapsed');
//             } catch (e) {}
//           })();
//         `}
//             </Script>
//
//             <div data-intranet>
//                 <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
//                 <Header onOpenMobile={() => setMobileOpen(true)} />
//
//                 <main className="main px-4 md:px-6">
//                     <div className="max-w-7xl mx-auto py-6">{children}</div>
//                 </main>
//
//                 <div id="portal-intranet" />
//             </div>
//         </>
//     )
// }


// 'use client'
// import React, {useEffect, useState} from 'react'
// import Sidebar from '@/widget/intranet/Sidebar'
// import Header from '@/widget/intranet/Header'
// import './intranet.css'
// import Script from 'next/script'
//
// export default function IntranetLayout({ children }: { children: React.ReactNode }) {
//     const [mobileOpen, setMobileOpen] = useState(false);
//
//     return (
//
//         <div data-intranet>               {/* <-- scope para el CSS local */}
//             <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
//             <Header onOpenMobile={() => setMobileOpen(true)} />
//             <main className="main px-4 md:px-6">
//                 <div className="max-w-7xl mx-auto py-6">{children}</div>
//             </main>
//
//             {/* ← portal raíz para modales del intranet */}
//             <div id="portal-intranet" />
//         </div>
//     )
// }