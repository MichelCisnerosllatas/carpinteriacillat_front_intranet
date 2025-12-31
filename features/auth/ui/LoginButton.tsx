//src/features/auth/ui/LoginButton.tsx;

// 'use client'
// import { useAuthStore } from '@/shared/store/authStore'
//
// export function LoginButton({ correo, clave }: { correo: string; clave: string }) {
//     const { iniciarSesion, cargando } = useAuthStore()
//
//     const handleLogin = async () => {
//         if (!correo || !clave) {
//             alert('Por favor ingresa correo y contraseña 1')
//             return
//         }
//
//         await iniciarSesion(correo, clave)
//     }
//
//     return (
//         <button
//             type="button"
//             onClick={handleLogin}
//             disabled={cargando}
//             className="btn-primary w-full"
//         >
//             {cargando ? 'Cargando...' : 'Iniciar sesión'}
//         </button>
//     )
// }

