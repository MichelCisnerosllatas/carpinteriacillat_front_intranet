// src/shared/lib/sweetalert2/sweetalert.ts
'use client'
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'
import '@/shared/lib/sweetalert2/sweetalert.css';

function currentAccent(): string {
    if (typeof document === 'undefined') return '#3b82f6'
    const scope = (document.querySelector('[data-intranet]') as HTMLElement) || document.documentElement
    const v = getComputedStyle(scope).getPropertyValue('--accent').trim()
    return v || '#3b82f6'
}

const baseClasses = {
    popup: 'swal-app-popup',
    title: 'swal-app-title',
    htmlContainer: 'swal-app-html',
    actions: 'swal-app-actions',
    confirmButton: 'swal-app-confirm',
    cancelButton: 'swal-app-cancel',
    denyButton: 'swal-app-deny',
    input: 'swal-app-input',
} as const

function themed(opts: SweetAlertOptions): SweetAlertOptions {
    if (typeof document !== 'undefined')
        document.documentElement.style.setProperty('--swal-accent', currentAccent())
    return {
        ...opts,
        customClass: { ...baseClasses, ...(opts.customClass as any) },
        buttonsStyling: false,
    }
}

export function swalAlert(options: {
    title: string
    text?: string
    icon?: SweetAlertIcon
} & SweetAlertOptions = {} as any) {
    const { title, text, icon = 'info', ...rest } = options
    return Swal.fire(themed({ title, text, icon, ...rest }))
}

export function swalConfirm(options: {
    title: string
    text?: string
    confirmText?: string
    cancelText?: string
    icon?: SweetAlertIcon
} & SweetAlertOptions) {
    const {
        title,
        text,
        confirmText = 'Aceptar',
        cancelText = 'Cancelar',
        icon = 'question',
        ...rest
    } = options
    return Swal.fire(
        themed({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            ...rest,
        })
    )
}
