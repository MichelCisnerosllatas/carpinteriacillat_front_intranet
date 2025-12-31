// src/features/auth/ui/LoginForm.tsx
'use client'
import { useState } from 'react'
import { useAuthStore } from '@/shared/store/auth/authStore'
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";



export function LoginForm() {
    const router = useRouter();
    const { iniciarSesion, loadinauth, error } = useAuthStore()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const ok = await iniciarSesion(email, password)

        // Solo redirige si el login fue exitoso
        if (ok) {
            const cookie = Cookies.get('user');
            let idrol = 0;
            if (cookie) {
                try {
                    const user = JSON.parse(cookie);
                    idrol = user.idrol;
                } catch {
                }
            }

            if(idrol == 1){
                router.push('/dashboard')
            } else if(idrol == 4){
                router.push('/disponibilidadhoraria')
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
                <span className="text-sm font-medium text-white">Correo institucional</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="tu.usuario@unap.edu.pe"
                    required={true}
                />
            </label>

            <label className="block">
                <span className="text-sm font-medium text-white">Contraseña</span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border text-white border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contraseña"
                    required={true}
                />
            </label>

            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
                disabled={loadinauth} >
                {loadinauth ? 'Cargando...' : 'Iniciar sesión'}
            </button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
    )
}
