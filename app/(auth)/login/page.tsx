//app/(auth)/login/page.tsx
'use client'

import Link from 'next/link'
import {LoginForm} from "@/features/auth/ui/LoginForm";
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-bg px-8 py-12">
            <div className="max-w-4xl w-full bg-transparent rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 backdrop-blur-sm">
                {/* Left: Branding */}
                <div className="p-8 bg-[linear-gradient(180deg,#0b8043,rgba(11,128,67,0.95))] text-white flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="overflow-hidden flex items-center justify-center">
                                <Image
                                    className="w-full h-full object-cover"
                                    src='/cillat/logo.png'
                                    alt='imagen logo'
                                    width='50'
                                    height='50'
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold">Carpintería CILLAT</h1>
                                <p className="text-sm opacity-90"> </p>
                            </div>
                        </div>

                        <div></div>

                        <div className="mt-8 text-sm leading-relaxed opacity-95">
                            Bienvenido a la intranet institucional. Ingresa con tu cuenta de la universidad para acceder a aulas, horarios y gestión académica.
                        </div>
                    </div>

                    <footer className="text-xs opacity-80 mt-6">
                        Av. Quiñones 1234, Iquitos • Teléfono: (065) 123-456
                    </footer>
                </div>

                {/* Right: Form */}
                <div className="p-8 md:p-10 bg-surface-2">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold ">Iniciar sesión</h2>
                        <p className="text-sm text-gray-500">Usa tu correo institucional para ingresar</p>
                    </div>

                    <LoginForm />
                    <div className="mt-6 text-sm text-center">
                        ¿No tienes cuenta?{' '}
                        <Link href="/register" className="text-accent-fg font-medium hover:underline">Crear una cuenta</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}