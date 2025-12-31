// src/shared/lib/sweetalert2/sweetalert.ts
'use client'
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import '@/shared/lib/sweetalert2/sweetalert.css';

/** Lee el color de acento actual (scope intranet si existe, o :root) */
function currentAccent(): string {
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
    // sincroniza el acento actual con el CSS de swal
    document.documentElement.style.setProperty('--swal-accent', currentAccent())
    return {
        ...opts,
        customClass: { ...baseClasses, ...(opts.customClass as any) },
        buttonsStyling: false, // usamos nuestras clases
    }
}

/* ==== API ==== */

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
    icon?: SweetAlertIcon | null
} & SweetAlertOptions) {
    const {
        title,
        text,
        confirmText = 'Aceptar',
        cancelText = 'Cancelar',
        icon, // 👈 sin valor por defecto
        ...rest
    } = options

    const themedOpts = themed({
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        ...(icon ? { icon } : {}), // 👈 solo agrega si existe
        ...rest,
    })

    return Swal.fire(themedOpts)
}

export function swalSuccess(
    title = 'Operación exitosa',
    text?: string,
    timer?: number
) {
    const opts: SweetAlertOptions = {
        icon: 'success',
        title,
        text,
    }

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
}) : Promise<string | null> {
    const { title, inputLabel, inputPlaceholder, input = 'text' } = options
    const res = await Swal.fire(
        themed({
            title,
            input,
            inputLabel,
            inputPlaceholder,
            confirmButtonText: 'Guardar',
            showCancelButton: true,
        })
    )
    return res.isConfirmed ? (res.value as string) : null
}


/**
 * Muestra una alerta de carga con spinner
 * Devuelve un objeto con funciones de control (update, close, enable/disable)
 */
export function swalLoading(options?: { title?: string; text?: string; allowOutsideClick?: boolean }) {
    const { title = 'Cargando...', text = '', allowOutsideClick = false } = options || {};

    // Crear la alerta
    Swal.fire(
        themed({
            title,
            text,
            allowOutsideClick,
            didOpen: () => {
                Swal.showLoading(); // muestra el spinner nativo
            },
            showConfirmButton: false,
            showCancelButton: false,
        })
    );

    // Devuelve un controlador para manipularla externamente
    return {
        /** Actualiza el contenido del modal */
        update: (newOpts: { title?: string; text?: string }) => Swal.update(newOpts),

        /** Cierra el modal */
        close: () => Swal.close(),

        /** Desactiva temporalmente los botones (si existen) */
        disableButtons: () => {
            const btns = Swal.getConfirmButton();
            if (btns) btns.disabled = true;
        },

        /** Activa los botones */
        enableButtons: () => {
            const btns = Swal.getConfirmButton();
            if (btns) btns.disabled = false;
        },
    };
}


export default { alert: swalAlert, confirm: swalConfirm, success: swalSuccess, error: swalError, toast: swalToast, prompt: swalPrompt }
