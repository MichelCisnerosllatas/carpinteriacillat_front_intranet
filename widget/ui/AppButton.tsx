// widget/ui/AppButton.tsx
'use client'

import * as React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

export type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
    function AppButton(
        {
            variant = 'primary',
            loading = false,
            leftIcon,
            rightIcon,
            className,
            disabled,
            type = 'button',
            children,
            ...props
        },
        ref
    ) {
        const isDisabled = disabled || loading

        const base =
            'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ' +
            'cursor-pointer ' + // ✅ manito por defecto
            'transition active:scale-[0.98] select-none ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-yellow)/.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]'


        const variants: Record<Variant, string> = {
            // usa tus tokens (sin “parpadeo” por colores hardcode)
            primary:
                'bg-primary text-primary-fg shadow-sm ' +
                'hover:opacity-95 ' +
                'disabled:opacity-60 disabled:cursor-not-allowed',
            secondary:
                'bg-surface-2 text-fg border border-border shadow-sm ' +
                'hover:bg-surface ' +
                'disabled:opacity-60 disabled:cursor-not-allowed',
            ghost:
                'bg-transparent text-fg ' +
                'hover:bg-surface-2 ' +
                'disabled:opacity-60 disabled:cursor-not-allowed',
            danger:
                'bg-danger text-danger-fg shadow-sm ' +
                'hover:opacity-95 ' +
                'disabled:opacity-60 disabled:cursor-not-allowed',
        }

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                className={[base, variants[variant], className ?? ''].join(' ')}
                {...props}
            >
                {loading ? <Spinner /> : leftIcon}
                <span>{children}</span>
                {rightIcon}
            </button>
        )
    }
)

function Spinner() {
    return (
        <span
            aria-hidden="true"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
    )
}
