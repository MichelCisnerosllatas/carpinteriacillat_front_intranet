'use client'

import React from 'react'
import Sidebar from '@/widget/intranet/Sidebar'
import Header from '@/widget/intranet/Header'

export default function IntranetShell({
                                          children,
                                          initialCollapsed,
                                      }: {
    children: React.ReactNode
    initialCollapsed: boolean
}) {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    return (
        <div data-intranet data-collapsed={initialCollapsed ? 'true' : 'false'}>
            <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
            <Header onOpenMobile={() => setMobileOpen(true)} />

            <main className="main px-4 md:px-6">
                <div className="max-w-7xl mx-auto py-6">{children}</div>
            </main>

            <div id="portal-intranet" />
        </div>
    )
}
