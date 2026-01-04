// shared/lib/sweetalert2/sweetalert.ts
'use client'

import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'
import '@/shared/lib/sweetalert2/sweetalert.css'

/** Lee el acento actual: usa tokens HSL del tema y los convierte a COLOR real */
function currentAccentColor(): string {
    const scope =
        (document.querySelector('[data-intranet]') as HTMLElement) ||
        document.documentElement

    // en tu theme: --accent = "48 99% 53%" (HSL sin hsl())
    const raw = getComputedStyle(scope).getPropertyValue('--accent2').trim()
    // si no existe, fallback azul
    if (!raw) return 'hsl(221 83% 53%)'
    return `hsl(${raw})`
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
    // sincroniza acento actual con CSS del modal
    document.documentElement.style.setProperty('--swal-accent', currentAccentColor())

    return {
        ...opts,
        customClass: { ...baseClasses, ...(opts.customClass as any) },
        buttonsStyling: false,
    }
}

/* ========= API BASE (lo tuyo) ========= */

export function swalAlert(
    options: { title: string; text?: string; icon?: SweetAlertIcon } & SweetAlertOptions = {} as any
) {
    const { title, text, icon = 'info', ...rest } = options
    return Swal.fire(themed({ title, text, icon, ...rest }))
}

export function swalConfirm(options: {
    title: string
    text?: string
    confirmText?: string
    cancelText?: string
    icon?: SweetAlertIcon | null
} & SweetAlertOptions) {
    const {
        title,
        text,
        confirmText = 'Aceptar',
        cancelText = 'Cancelar',
        icon,
        ...rest
    } = options

    return Swal.fire(
        themed({
            title,
            text,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,

            focusConfirm: true,   // ✅ foco en "Sí"
            focusCancel: false,
            returnFocus: false,

            ...(icon ? { icon } : {}),
            ...rest,
        })
    )
}


export function swalSuccess(title = 'Operación exitosa', text?: string, timer?: number) {
    const opts: SweetAlertOptions = { icon: 'success', title, text }
    if (timer) {
        opts.timer = timer
        opts.showConfirmButton = false
    }
    return Swal.fire(themed(opts))
}

export function swalError(title = 'Ocurrió un error', text?: string) {
    return Swal.fire(themed({ icon: 'error', title, text }))
}

export function swalToast(options: {
    title: string
    icon?: SweetAlertIcon
    timer?: number
    position?: SweetAlertOptions['position']
}) {
    const { title, icon = 'success', timer = 2000, position = 'top-end' } = options
    return Swal.fire(
        themed({
            title,
            icon,
            toast: true,
            position,
            timer,
            showConfirmButton: false,
        })
    )
}

export async function swalPrompt(options: {
    title: string
    inputLabel?: string
    inputPlaceholder?: string
    input?: SweetAlertOptions['input']
}): Promise<string | null> {
    const { title, inputLabel, inputPlaceholder, input = 'text' } = options
    const res = await Swal.fire(
        themed({
            title,
            input,
            inputLabel,
            inputPlaceholder,
            confirmButtonText: 'Guardar',
            showCancelButton: true,
            reverseButtons: true,
        })
    )
    return res.isConfirmed ? (res.value as string) : null
}

/* ========= LOADING CONTROLABLE ========= */

export function swalLoading(options?: {
    title?: string
    text?: string
    allowOutsideClick?: boolean
}) {
    const { title = 'Cargando...', text = '', allowOutsideClick = false } = options || {}

    Swal.fire(
        themed({
            title,
            text,
            allowOutsideClick,
            didOpen: () => Swal.showLoading(),
            showConfirmButton: false,
            showCancelButton: false,
        })
    )

    return {
        update: (newOpts: { title?: string; text?: string; html?: string }) => Swal.update(newOpts),
        close: () => Swal.close(),
    }
}

/* ========= NUEVO: CONFIRM ASYNC (SI = LOADING, NO CIERRA, UPDATE DINÁMICO) ========= */

export async function swalConfirmAsync<T = unknown>(options: {
    title: string
    text?: string
    html?: string
    icon?: SweetAlertIcon | null
    confirmText?: string
    cancelText?: string
    loadingText?: string

    onConfirm: (ctx: {
        update: (p: { title?: string; text?: string; html?: string }) => void
        close: () => void
        setConfirmText: (t: string) => void
    }) => Promise<T>
} & SweetAlertOptions): Promise<
    | { ok: true; data: T }
    | { ok: false; cancelled: true }
    | { ok: false; error: any }
> {
    const {
        title,
        text,
        html,
        icon,
        confirmText = 'Sí',
        cancelText = 'Cancelar',
        loadingText = 'Procesando...',
        onConfirm,
        ...rest
    } = options

    const setLoading = (loading: boolean) => {
        const confirmBtn = Swal.getConfirmButton()
        const cancelBtn = Swal.getCancelButton()
        if (!confirmBtn) return

        if (loading) {
            confirmBtn.disabled = true
            if (cancelBtn) cancelBtn.disabled = true

            confirmBtn.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:.5rem;">
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          <span>${loadingText}</span>
        </span>
      `
        } else {
            confirmBtn.disabled = false
            if (cancelBtn) cancelBtn.disabled = false
            confirmBtn.textContent = confirmText
        }
    }

    const update = (p: { title?: string; text?: string; html?: string }) => {
        Swal.update({
            ...(p.title !== undefined ? { title: p.title } : {}),
            ...(p.text !== undefined ? { text: p.text } : {}),
            ...(p.html !== undefined ? { html: p.html } : {}),
        })
    }

    const setConfirmText = (t: string) => {
        const btn = Swal.getConfirmButton()
        if (btn) btn.textContent = t
    }

    const res = await Swal.fire(
        themed({
            title,
            ...(html ? { html } : { text: text ?? '' }),
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
            ...(icon ? { icon } : {}),

            // ✅ NO cerrar al confirmar mientras ejecuta
            preConfirm: async () => {
                try {
                    setLoading(true)
                    const data = await onConfirm({
                        update,
                        close: () => Swal.close(),
                        setConfirmText,
                    })
                    return data
                } catch (err: any) {
                    Swal.showValidationMessage(err?.message ?? 'Ocurrió un error')
                    return undefined
                } finally {
                    setLoading(false)
                }
            },

            allowOutsideClick: () => !Swal.isLoading(),
            ...rest,
        })
    )

    if (res.isDismissed) return { ok: false, cancelled: true }
    if (res.value === undefined) return { ok: false, error: 'Validation failed' }
    return { ok: true, data: res.value as T }
}

export default {
    alert: swalAlert,
    confirm: swalConfirm,
    confirmAsync: swalConfirmAsync,
    success: swalSuccess,
    error: swalError,
    toast: swalToast,
    prompt: swalPrompt,
    loading: swalLoading,
}
