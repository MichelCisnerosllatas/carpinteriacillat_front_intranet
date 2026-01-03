// /shared/api/v1/handleApiError.ts
import { AxiosError } from "axios";
import { ApiResponse } from "@/shared/types/api";

/**
 * Convierte CUALQUIER error de Axios a ApiResponse<T>
 * Soporta:
 * - Sin respuesta (red/cors/timeout) => status 0
 * - Laravel 422 => { message, errors }
 * - 500/403/etc => { message } o formatos raros
 */
export function handleApiError<T = any>(error: unknown): ApiResponse<T> {
    const err = error as AxiosError<any>;
    const raw = err.response?.data ?? {};

    // 1) Sin respuesta: CORS, timeout, red
    if (!err.response) {
        let message = "No se pudo conectar con el servidor. Verifica tu conexión.";
        if (err.message?.includes("timeout")) message = "Tiempo de espera agotado. Intenta nuevamente.";
        if (err.message?.includes("Network Error")) message = "Error de red. Verifica tu conexión a internet.";
        if (err.code === "ERR_CANCELED") message = "Solicitud cancelada por el usuario.";

        return { success: false, status: 0, message, data: undefined, errors: null };
    }

    // 2) Laravel validation error típico => raw.errors
    const extractedErrors =
        raw?.errors && typeof raw.errors === "object"
            ? (raw.errors as Record<string, string[]>)
            : null;

    // 3) message: Laravel suele mandar raw.message
    const message =
        String(raw?.message ?? "") ||
        err.message ||
        "Error desconocido";

    return {
        success: false,
        status: err.response.status,
        message,
        data: undefined,
        errors: extractedErrors,
    };
}

//
// import { AxiosError } from "axios";
// import { ApiResponse } from "@/shared/types/api";
//
// // Puedes importar tu logger si usas Sentry o algo similar
// // import * as Sentry from "@sentry/browser";
//
// /**
//  * Maneja errores de Axios y devuelve un ApiResponse<T> tipado.
//  * Soporta errores de red, timeout, validaciones (Laravel, Django, Go).
//  */
// export function handleApiError<T = any>(error: unknown): ApiResponse<T> {
//     const err = error as AxiosError<any>;
//     const raw = err.response?.data ?? {};
//
//     // 1 Si no hay respuesta (error de red, CORS, timeout, etc.)
//     if (!err.response) {
//         let message = "No se pudo conectar con el servidor. Verifica tu conexión.";
//         if (err.message?.includes("timeout")) {
//             message = "Tiempo de espera agotado. Intenta nuevamente.";
//         } else if (err.message?.includes("Network Error")) {
//             message = "Error de red. Verifica tu conexión a internet.";
//         } else if (err.code === "ERR_CANCELED") {
//             message = "Solicitud cancelada por el usuario.";
//         }
//
//         // Log opcional: útil para producción
//         // Sentry.captureException(err);
//         // console.error("[Network/API Error]", err);
//
//         return {
//             success: false,
//             status: 0, // sin status (porque no hubo respuesta del servidor)
//             message,
//             data: undefined,
//             errors: null,
//         };
//     }
//
//     // 2 Si sí hay respuesta del backend (errores 4xx / 5xx)
//     let extractedErrors: Record<string, string[]> | null = null;
//
//     if (raw && typeof raw === "object") {
//         if (raw.errors && typeof raw.errors === "object") {
//             extractedErrors = raw.errors as Record<string, string[]>;
//         } else {
//             const entries = Object.entries(raw);
//             if (entries.length > 0) {
//                 extractedErrors = Object.fromEntries(
//                     entries.map(([k, v]) => [k, Array.isArray(v) ? v : [String(v)]])
//                 ) as Record<string, string[]>;
//             }
//         }
//     }
//
//     const message = (raw?.message as string) || err.message || "Error desconocido al procesar la solicitud";
//
//     // Log opcional
//     if (err.response?.status && err.response.status >= 500) {
//         console.error("[Server Error]", err.response);
//         // Sentry.captureException(err);
//     }
//
//     return {
//         success: false,
//         status: err.response?.status || 500,
//         message,
//         data: undefined,
//         errors: extractedErrors ?? {},
//     };
// }
