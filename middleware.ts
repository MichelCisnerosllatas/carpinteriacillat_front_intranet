// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🔹 Mapa de rutas permitidas por idrol
// 1 = admin, 2 = docente, 3 = estudiante
const roleAccess: Record<string, string[]> = {
    "1": [
        // admin tiene acceso total
        "/"
    ],

    "2": [
        //docentes
        "/disponibilidadhoraria"
    ],
    "3": [
        "/perfil",
        "/recursos"
    ],
};


// Rutas públicas
const publicRoutes = ["/login", "/register", "/olvidarclave", "/sinpermiso"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;
    const userCookie = req.cookies.get("user")?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;

    // console.log("Token en middleware:", token);
    // console.log("userCookie en middleware:", userCookie);
    // console.log("userCookie en middleware:", userCookie);
    // console.log("userjoin en middleware:", userjoin);

    // ✅ Permitir acceso a rutas públicas
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
    if (isPublic) return NextResponse.next();

    // 🚫 Sin token o sin usuario → al login
    if (!token || !user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = String(user?.role_id || ""); // fuerza a string
    const allowedRoutes = roleAccess[userRole] || [];

    // ✅ Si es admin (1), acceso total
    if (userRole === "1") {
        return NextResponse.next();
    }

    // 🕵️‍♂️ Verificar si la ruta está permitida
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
        // console.warn(`🚫 Acceso denegado a ${pathname} para rol: ${userRole}`);
        return NextResponse.redirect(new URL("/sinpermiso", req.url));
    }

    return NextResponse.next();
}

// 🔧 Configurar para que aplique a todo menos archivos estáticos
export const config = {
    matcher: [
        // Aplica el middleware a todo excepto rutas públicas y recursos estáticos
        "/((?!_next/static|_next/image|favicon.ico|img|docs|uploads|cillat).*)",
        // "/((?!_next/static|_next/image|favicon.ico|img|docs|uploads).*)",
    ],
};

// export const config = {
//     matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };





// // src/middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
//
// export async function middleware(req: NextRequest) {
//     const { pathname } = req.nextUrl
//     const token = req.cookies.get('token')?.value
//     const userCookie = req.cookies.get('userjoin')?.value
//     const userjoin = userCookie ? JSON.parse(userCookie) : null
//
//     // if (userjoin?.rol !== 'admin') {
//     //     return NextResponse.redirect(new URL('/sin-permiso', req.url))
//     // }
//
//     // console.log('🔍 Middleware ejecutándose en:', pathname)
//     console.log('token:', token);
//
//     // Rutas públicas (login, registro, recuperar contraseña)
//     const publicRoutes = ['/login', '/register', '/olvidarclave']
//     const isPublic = publicRoutes.some((route) => pathname.startsWith(route))
//
//     // Si NO hay token ni usuario y no está en ruta pública → redirigir a login
//     if ((!token || !userjoin) && !isPublic) {
//         console.log('No hay token o usuario, redirigiendo a /login')
//         return NextResponse.redirect(new URL('/login', req.url))
//     }
//
//     // Si hay token y usuario y está en ruta pública → redirigir al dashboard
//     if (token && userjoin && isPublic) {
//         console.log('✅ Tiene token y usuario, redirigiendo a /dashboard')
//         return NextResponse.redirect(new URL('/dashboard', req.url))
//     }
//
//     // // ⚙️ Validar token con backend (opcional, pero más seguro)
//     // if (token) {
//     //     try {
//     //         const res = await fetch(`${process.env.API_URL}/auth/validate`, {
//     //             headers: { Authorization: `Bearer ${token}` },
//     //         })
//     //
//     //         // Si el token no es válido, limpiar y redirigir
//     //         if (!res.ok) {
//     //             console.log('⛔ Token inválido o expirado, redirigiendo a /login')
//     //             const response = NextResponse.redirect(new URL('/login', req.url))
//     //             response.cookies.delete('token')
//     //             response.cookies.delete('userjoin')
//     //             return response
//     //         }
//     //     } catch (error) {
//     //         console.error('❌ Error validando token:', error)
//     //         return NextResponse.redirect(new URL('/login', req.url))
//     //     }
//     // }
//
//     // ✅ Permitir acceso normal
//     return NextResponse.next()
// }
//
// // ✅ Aplica a todas las rutas menos las estáticas
// export const config = {
//     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// }