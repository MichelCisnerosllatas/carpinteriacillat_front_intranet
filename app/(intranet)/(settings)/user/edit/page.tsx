//app/(intranet)/(settings)/user/edit/page.tsx
"use client";
// app/(intranet)/(settings)/user/edit/page.tsx
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { HeaderNavegacion } from "@/widget/intranet/HeaderNavegacion";
import UserForm from "@/features/users/ui/mantuser/UserForm";

export default function Page() {
    const sp = useSearchParams();
    const id = useMemo(() => Number(sp.get("id") ?? 0), [sp]);

    const misBreadcrumbs = [
        { label: "Usuarios", href: "/user" },
        { label: "Editar Usuario" },
    ];

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            <HeaderNavegacion
                title="Editar Usuario"
                description="Edita la información del colaborador."
                breadcrumbs={misBreadcrumbs}
            />

            {/* ✅ Solo pasas el id */}
            <UserForm id={id}/>
        </div>
    );
}
