//shared/lib/cleanParams.ts
export function cleanParams<T extends Record<string, any>>(params?: T): Partial<T> | undefined {
    if (!params) return undefined;

    const out: Record<string, any> = {};

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;

        if (typeof value === "string") {
            const v = value.trim();
            if (v === "") continue;      // ✅ no mandar vacíos
            out[key] = v;
            continue;
        }

        // números: si quieres permitir 0, se queda
        // si NO quieres mandar 0, descomenta:
        // if (typeof value === "number" && value === 0) continue;

        out[key] = value;
    }

    return Object.keys(out).length ? (out as Partial<T>) : undefined;
}
