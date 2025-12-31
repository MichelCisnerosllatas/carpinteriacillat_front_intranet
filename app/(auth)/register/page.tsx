// src/app/(auth)/register/HorarioNuevoCliente.tsx.tsx
export default function RegisterPage() {
    return (
        <div className="auth-card">
            <div className="brand">
                <div className="brand-badge">I</div>
                <div>
                    <div className="text-sm font-semibold">Crear cuenta</div>
                    <div className="muted">Completa tus datos</div>
                </div>
            </div>

            <form className="space-y-3">
                <div className="space-y-1">
                    <label className="text-sm">Nombre</label>
                    <input name="name" className="auth-input" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm">Correo</label>
                    <input name="email" type="email" className="auth-input" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm">Contraseña</label>
                    <input name="password" type="password" className="auth-input" />
                </div>
                <button className="auth-button">Registrarme</button>
            </form>
        </div>
    )
}
