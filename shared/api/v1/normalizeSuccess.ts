// /shared/api/v1/normalizeSuccess.ts
import { ApiResponse } from "@/shared/types/api";

/**
 * Normaliza respuestas exitosas al estándar ApiResponse<T>
 * ⚠️ Aquí asumimos que "raw" viene como:
 * { success, status, message, data }
 */
export function normalizeSuccess<T>(raw: any): ApiResponse<T> {
    return {
        success: Boolean(raw?.success ?? true),
        status: Number(raw?.status ?? 200),
        message: String(raw?.message ?? "OK"),
        data: raw?.data as T,
        errors: null,
    };
}
