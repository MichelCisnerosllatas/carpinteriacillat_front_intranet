// app/theme/page.tsx
import ThemePageClient from "./theme-page-client";

export default function Page() {
    return (
        <div className="min-h-screen bg-bg text-fg">
            <div className="mx-auto max-w-4xl p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Theme opciones elegantes</h1>
                        <p className="mt-1 text-sm text-muted-fg">
                            Cambia el modo de apariencia del sistema.
                        </p>
                    </div>
                </div>

                {/* ✅ Preview de colores (para ver las 3 bases) */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-bg p-4">
                        <div className="text-sm font-semibold">Body</div>
                        <div className="text-xs text-muted-fg">bg-bg</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface p-4">
                        <div className="text-sm font-semibold">Surface</div>
                        <div className="text-xs text-muted-fg">bg-surface</div>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface-2 p-4">
                        <div className="text-sm font-semibold">Surface 2</div>
                        <div className="text-xs text-muted-fg">bg-surface-2</div>

                        <button className="mt-3 rounded-lg bg-primary px-3 py-2 text-primary-fg">
                            Botón primary
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <ThemePageClient />
                </div>
            </div>
        </div>
    );
}
