// widgets/intranet/ToolTip.tsx
'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'

function isCollapsed() {
    const root = document.querySelector('[data-intranet]') as HTMLElement | null
    return root?.getAttribute('data-collapsed') === 'true'
}

export default function Tooltip({ label }: { label: string }) {
    const anchorRef = React.useRef<HTMLSpanElement | null>(null)
    const [visible, setVisible] = React.useState(false)
    const [pos, setPos] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 })

    React.useEffect(() => {
        const el = anchorRef.current
        if (!el) return
        const trigger = el.closest('.navlink') as HTMLElement | null
        if (!trigger) return

        const compute = () => {
            const r = trigger.getBoundingClientRect()
            setPos({ top: r.top + r.height / 2, left: r.right + 10 })
        }

        const onEnter = () => {
            if (!isCollapsed()) return
            compute()
            setVisible(true)
        }
        const onLeave = () => setVisible(false)

        trigger.addEventListener('mouseenter', onEnter)
        trigger.addEventListener('mouseleave', onLeave)

        const onMove = () => visible && compute()
        window.addEventListener('scroll', onMove, true)
        window.addEventListener('resize', onMove)

        const onCollapsedChange = () => { if (!isCollapsed()) setVisible(false) }
        window.addEventListener('intranet:collapsed', onCollapsedChange)

        return () => {
            trigger.removeEventListener('mouseenter', onEnter)
            trigger.removeEventListener('mouseleave', onLeave)
            window.removeEventListener('scroll', onMove, true)
            window.removeEventListener('resize', onMove)
            window.removeEventListener('intranet:collapsed', onCollapsedChange)
        }
    }, [visible])

    return (
        <>
            <span ref={anchorRef} style={{ display: 'none' }} />
            {visible && createPortal(
                <div role="tooltip" style={{ position: 'fixed', top: pos.top, left: pos.left, transform: 'translateY(-50%)', zIndex: 9999 }}>
                    <div
                        style={{
                            background: 'var(--surfacec)',
                            color: 'var(--fgc)',
                            border: '1px solid var(--borderc)',
                            padding: '6px 10px',
                            borderRadius: 10,
                            boxShadow: '0 14px 40px rgba(0,0,0,.35)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {label}
                        <span
                            style={{
                                position: 'absolute',
                                left: -7,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 0,
                                height: 0,
                                borderTop: '7px solid transparent',
                                borderBottom: '7px solid transparent',
                                borderRight: '7px solid var(--surfacec)',
                                filter: 'drop-shadow(-1px 0 0 var(--borderc))'
                            }}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
