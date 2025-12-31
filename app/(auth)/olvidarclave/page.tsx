// src/app/(auth)/olvide-clave/HorarioNuevoCliente.tsx.tsx
export default function ForgotPage() {
    return (
        <div className="auth-card">
            <div className="brand">
                <div className="brand-badge">I</div>
                <div>
                    <div className="text-sm font-semibold">Recuperar acceso</div>
                    <div className="muted">Te enviaremos instrucciones</div>
                </div>
            </div>

            <form className="space-y-3">
                <div className="space-y-1">
                    <label className="text-sm">Correo</label>
                    <input name="email" type="email" className="auth-input" />
                </div>
                <button className="auth-button">Enviar enlace</button>
            </form>
        </div>
    )
}
