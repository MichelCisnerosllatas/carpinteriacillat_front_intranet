// features/users/ui/mantuser/UserForm.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CirculeProgress from "@/widget/intranet/CirculeProgress";

import { useCreateUserStore } from "@/shared/store/user/useCreateUserStore";
import { useUpdateUserStore } from "@/shared/store/user/useUpdateUserStore";
import {UserApi} from "@/features/users/api/UserApi";

type UserFormProps = {
    id?: number; // ✅ si viene >0 edita, si no crea
};

type FormState = {
    name : string;
    email: string;
    role_id: string;
    password: string;
    password2: string;
    activo: boolean;
};

const emptyForm: FormState = {
    name: "",
    email: "",
    password: "",
    password2: "",
    activo: true,
    role_id: "1",
};

export default function UserForm({ id }: UserFormProps) {
    const isEdit = (id ?? 0) > 0;

    const [form, setForm] = useState<FormState>(emptyForm);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const create = useCreateUserStore((s) => s.create);
    const creating = useCreateUserStore((s) => s.isloading);

    const update = useUpdateUserStore((s) => s.update);
    const updating = useUpdateUserStore((s) => s.isloading);

    const isSaving = creating || updating;

    // 1) si es editar, trae detalle y llena form
    useEffect(() => {
        const run = async () => {
            if (!isEdit) {
                setForm(emptyForm);
                return;
            }

            setLoadingDetail(true);
            try {
                //ejemplo: tu API debe tener algo como get_user(id)
                const res = await UserApi.details_user(id!);
                if (!res.success) throw new Error(res.message);
                const u = res.data;

                setForm((prev) => ({
                    ...prev,
                    name: u?.name ?? "",
                    email: u?.email ?? "",
                    role_id: u?.role?.id.toString() ?? "Administrador",
                    password: "",
                    password2: "",
                    activo: true
                }));
            } catch (e: any) {
                toast.error(e?.message ?? "Error al cargar usuario");
            } finally {
                setLoadingDetail(false);
            }
        };

        run();
    }, [isEdit, id]);

    // helpers para cambiar inputs
    const setField = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value =
            e.target instanceof HTMLInputElement && e.target.type === "checkbox"
                ? e.target.checked
                : e.target.value;

        setForm((p) => ({ ...p, [key]: value as any }));
    };

    // validación simple
    const canSubmit = useMemo(() => {
        if (!form.name.trim()) return false;
        if (!form.email.trim()) return false;

        // CREATE: password obligatorio
        if (!isEdit) {
            if (!form.password.trim()) return false;
            if (form.password !== form.password2) return false;
        }

        // EDIT: password opcional, pero si lo escribe, debe coincidir
        if (isEdit) {
            if (form.password || form.password2) {
                if (form.password !== form.password2) return false;
            }
        }

        return true;
    }, [form, isEdit]);

    // 2) submit: decide create vs update
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit || isSaving) return;

        const payload: any = {
            nombres: form.name,
            email: form.email,
            activo: form.activo ? 1 : 0,
            rol: form.role_id,
            ...(form.password ? { password: form.password } : {}),
        };

        if (!isEdit) {
            const newId = await create(payload);
            if (newId > 0) toast.success("Usuario creado correctamente");
            return;
        }

        const ok = await update(id!, payload);
        if (ok) toast.success("Usuario actualizado correctamente");
    };

    if (loadingDetail) return <CirculeProgress />;

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- COLUMNA 1 y 2: DATOS DEL FORMULARIO (span-2) --- */}
            {/* Al usar col-span-2, esta tarjeta ocupa el 66% del ancho */}
            <div className="lg:col-span-2 space-y-6">

                <div className="bg-surface p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold  mb-6 border-b pb-4">
                        Información Personal
                    </h2>

                    {/* Grid interno para ordenar inputs dentro de la tarjeta ancha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nombres</label>
                            <input value={form.name} onChange={setField("name")} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Juan Carlos" />
                        </div>

                        {/* Apellidos */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Apellidos</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Pérez López" />
                        </div>

                        {/* Correo (Full width en móvil, mitad en desktop) */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input value={form.email} onChange={setField("email")} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="usuario@empresa.com" />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Teléfono / Celular</label>
                            <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="+51 999 000 000" />
                        </div>

                        {/* Cargo */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Cargo / Puesto</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Analista de Sistemas" />
                        </div>

                    </div>
                </div>

                {/* SECCIÓN SEGURIDAD (Otra tarjeta abajo, mismo ancho) */}
                <div className="bg-surface p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-6 border-b pb-4">Seguridad</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Contraseña</label>
                            <input value={form.password} onChange={setField("password")} type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Repetir Contraseña</label>
                            <input value={form.password2} onChange={setField("password2")} type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
                        </div>
                    </div>

                    {form.password || form.password2 ? (
                        form.password !== form.password2 ? (
                            <p className="mt-3 text-sm text-red-600">Las contraseñas no coinciden.</p>
                        ) : null
                    ) : null}
                </div>

            </div>

            {/* --- COLUMNA 3: FOTO Y EXTRAS (span-1) --- */}
            {/* Esta columna ocupa el 33% restante */}
            <div className="lg:col-span-1 space-y-6">

                {/* Tarjeta de Foto */}
                <div className="bg-surface p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                    <h3 className="font-medium mb-4">Foto de Perfil</h3>

                    <div className="relative w-40 h-40 mb-4 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden hover:border-blue-500 transition-colors cursor-pointer group">
                        {/* Icono Placeholder */}
                        <svg className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {/* Input oculto real para subir archivo */}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                        Formatos permitidos: JPG, PNG.<br/>Máx. 2MB.
                    </p>

                    <button type="button" className="text-sm text-blue-600 font-medium hover:underline">
                        Subir imagen
                    </button>
                </div>

                {/* Tarjeta de Estado / Roles */}
                <div className="bg-surface p-6 rounded-xl shadow-sm">
                    <h3 className="font-medium mb-4">Configuración</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Usuario Activo</span>
                            {/* Toggle Switch simple */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Rol del Sistema</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Administrador</option>
                                <option>Editor</option>
                                <option>Usuario Estándar</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción Global */}
                <div className="flex flex-col gap-3 pt-0">
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md transition-all">
                        Guardar Usuario
                    </button>
                </div>
            </div>
        </form>
    );
}

// type UserFormProps = {
//     id?: number
// };
//
// export default function UserForm() {
//     return(
//         <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//
//             {/* --- COLUMNA 1 y 2: DATOS DEL FORMULARIO (span-2) --- */}
//             {/* Al usar col-span-2, esta tarjeta ocupa el 66% del ancho */}
//             <div className="lg:col-span-2 space-y-6">
//
//                 <div className="bg-surface p-8 rounded-xl shadow-sm">
//                     <h2 className="text-xl font-semibold  mb-6 border-b pb-4">
//                         Información Personal
//                     </h2>
//
//                     {/* Grid interno para ordenar inputs dentro de la tarjeta ancha */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//
//                         {/* Nombre */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Nombres</label>
//                             <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Juan Carlos" />
//                         </div>
//
//                         {/* Apellidos */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Apellidos</label>
//                             <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Pérez López" />
//                         </div>
//
//                         {/* Correo (Full width en móvil, mitad en desktop) */}
//                         <div className="space-y-2 md:col-span-2">
//                             <label className="text-sm font-medium text-gray-700">Correo Electrónico Institucional</label>
//                             <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="usuario@empresa.com" />
//                         </div>
//
//                         {/* Teléfono */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Teléfono / Celular</label>
//                             <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="+51 999 000 000" />
//                         </div>
//
//                         {/* Cargo */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Cargo / Puesto</label>
//                             <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Analista de Sistemas" />
//                         </div>
//
//                     </div>
//                 </div>
//
//                 {/* SECCIÓN SEGURIDAD (Otra tarjeta abajo, mismo ancho) */}
//                 <div className="bg-surface p-8 rounded-xl shadow-sm">
//                     <h2 className="text-xl font-semibold mb-6 border-b pb-4">Seguridad</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Contraseña</label>
//                             <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Repetir Contraseña</label>
//                             <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
//                         </div>
//                     </div>
//                 </div>
//
//             </div>
//
//             {/* --- COLUMNA 3: FOTO Y EXTRAS (span-1) --- */}
//             {/* Esta columna ocupa el 33% restante */}
//             <div className="lg:col-span-1 space-y-6">
//
//                 {/* Tarjeta de Foto */}
//                 <div className="bg-surface p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
//                     <h3 className="font-medium mb-4">Foto de Perfil</h3>
//
//                     <div className="relative w-40 h-40 mb-4 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden hover:border-blue-500 transition-colors cursor-pointer group">
//                         {/* Icono Placeholder */}
//                         <svg className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         {/* Input oculto real para subir archivo */}
//                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
//                     </div>
//
//                     <p className="text-xs text-gray-500 mb-4">
//                         Formatos permitidos: JPG, PNG.<br/>Máx. 2MB.
//                     </p>
//
//                     <button type="button" className="text-sm text-blue-600 font-medium hover:underline">
//                         Subir imagen
//                     </button>
//                 </div>
//
//                 {/* Tarjeta de Estado / Roles */}
//                 <div className="bg-surface p-6 rounded-xl shadow-sm">
//                     <h3 className="font-medium mb-4">Configuración</h3>
//
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-600">Usuario Activo</span>
//                             {/* Toggle Switch simple */}
//                             <label className="relative inline-flex items-center cursor-pointer">
//                                 <input type="checkbox" defaultChecked className="sr-only peer" />
//                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                             </label>
//                         </div>
//
//                         <div className="space-y-2">
//                             <label className="text-sm text-gray-600">Rol del Sistema</label>
//                             <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                                 <option>Administrador</option>
//                                 <option>Editor</option>
//                                 <option>Usuario Estándar</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Botones de Acción Global */}
//                 <div className="flex flex-col gap-3 pt-0">
//                     <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md transition-all">
//                         Guardar Usuario
//                     </button>
//                 </div>
//             </div>
//         </form>
//     );
// }