"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SinPermisoPage() {
    const router = useRouter();

    useEffect(() => {
        try {
            const cookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith("user="));

            if (!cookie) {
                router.push("/login");
                return;
            }

            const user = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
            const rol = String(user?.idrol);

            // rutas base por rol numérico
            const homeByRole: Record<string, string> = {
                "1": "/dashboard",
                "4": "/disponibilidadhoraria",
                "3": "/perfil",
            };

            const redirectPath = homeByRole[rol] || "/login";

            setTimeout(() => router.push(redirectPath), 2500);
        } catch (e) {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen  bg-app">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
                🚫 Acceso denegado
            </h1>
            <p className="text-gray-600 mb-2">
                No tienes permisos para acceder a esta sección.
            </p>
            <p className="text-sm text-gray-500">
                Serás redirigido automáticamente a tu inicio...
            </p>
        </div>
    );
}
