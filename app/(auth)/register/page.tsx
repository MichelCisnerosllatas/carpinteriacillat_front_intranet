//  src/app/(auth)/register/page.tsx
"use client";

import React from "react";
import { AppInput } from "@/widget/ui/AppInput";
import { PasswordInput } from "@/widget/ui";
import {KeyIcon, Lock, Mail, User} from "lucide-react";
import { useRegisterStore } from "@/shared/store/auth/useRegisterStore";
import {useRouter} from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const { register, loading, apiError, fieldErrors, clearErrors } = useRegisterStore();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [pass, setPass] = React.useState("");
    const [pass2, setPass2] = React.useState("");
    const [roleId] = React.useState("1");  //fijo por ahora

    const { clearFieldError } = useRegisterStore();

    const clearLocal = (key: keyof typeof localErrors) => {
        setLocalErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

     // helper para inputs normales
    const onChangeText = (setValue: (v: string) => void, localKey: keyof typeof localErrors, apiKey: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setValue(v);

         // limpia errores al escribir
        clearLocal(localKey);
        clearFieldError(apiKey);
    };


     // errores locales rápidos (opcional)
    const [localErrors, setLocalErrors] = React.useState<{ email?: string; pass?: string; name?: string; pass2?: string }>({});

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

         // ✅ validación rápida frontend
        const next: typeof localErrors = {};
        if (!name.trim()) next.name = "El nombre es obligatorio";
        if (!email.trim()) next.email = "El correo es obligatorio";
        if (!pass.trim()) next.pass = "La contraseña es obligatoria";
        if (pass && pass.length < 6) next.pass = "Mínimo 6 caracteres";
        if (!pass2.trim()) next.pass2 = "Confirma tu contraseña";
        if (pass && pass2 && pass !== pass2) next.pass2 = "Las contraseñas no coinciden";

        setLocalErrors(next);

        if (Object.keys(next).length > 0) return;

         // ✅ llamar zustand
        const res = await register({
            name,
            role_id: roleId,
            email,
            password: pass,
            password_confirmation: pass2,
        });

        if (res.success) {
            router.push("/dashboard");
             // aquí navegas o toast
            // console.log("Registro OK:", res.data);
        }
    };

     // helper: toma primer error laravel por campo
    const fe = (key: string) => fieldErrors?.[key]?.[0];

    return (
        <div className="relative min-h-screen overflow-hidden bg-bg text-fg">
            {/* ... tu background decor igual ... */}

            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
                <div className="w-full overflow-hidden rounded-3xl bg-surface-2/70 shadow-2xl backdrop-blur-xl">
                    <div className="grid md:grid-cols-2">
                        {/* Left igual ... */}
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_60%)]" />
                            <div className="relative flex h-full flex-col justify-between p-10">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground font-bold shadow">
                                        I
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">Crear cuenta</div>
                                        <div className="text-sm text-muted-fg">Completa tus datos</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xl font-semibold leading-snug">
                                        Empieza a gestionar todo desde un solo lugar.
                                    </p>
                                    <p className="text-sm text-muted-fg">
                                        Registro rápido, seguridad y una experiencia moderna.
                                    </p>

                                    <div className="mt-6 grid gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-muted-fg">
                                             <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                                 ✓
                                             </span>
                                            Acceso en segundos
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-fg">
                                             <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                                 ✓
                                             </span>
                                            Datos protegidos
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-fg">
                       <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
                         ✓
                       </span>
                                            Interfaz limpia y rápida
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-muted-fg">
                                    © {new Date().getFullYear()} Tu marca. Todos los derechos reservados.
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-10">
                            {/* header igual ... */}

                            <form onSubmit={onSubmit} className="space-y-4">
                                <AppInput
                                    required={true}
                                    label="Nombre"
                                    value={name}
                                    leftIcon={<User size={18} />}
                                    onChange={onChangeText(setName, "name", "name")}
                                    error={localErrors.name || fe("name")}
                                />

                                <AppInput
                                    required={true}
                                    label="Correo"
                                    value={email}
                                    leftIcon={<Mail size={18} />}
                                    onChange={onChangeText(setEmail, "email", "email")}
                                    error={localErrors.email || fe("email")}
                                />

                                <PasswordInput
                                    required={true}
                                    label="Contraseña"
                                    value={pass}
                                    leftIcon={<Lock size={18} />}
                                    onChange={onChangeText(setPass, "pass", "password")}
                                    error={localErrors.pass || fe("password")}
                                />

                                <PasswordInput
                                    required={true}
                                    label="Confirmar contraseña"
                                    value={pass2}
                                    leftIcon={<Lock size={18} />}
                                    onChange={onChangeText(setPass2, "pass2", "password_confirmation")}
                                    error={localErrors.pass2 || fe("password_confirmation")}
                                />


                                {/* ✅ Error general (si quieres mostrar arriba del botón) */}
                                {apiError && (
                                    <p className="text-sm text-danger">
                                        {apiError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-brand-orange text-danger-fg px-4 py-2 rounded-xl hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
                                >
                                    {loading ? "Registrando..." : "Registrarme"}
                                    <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
                                </button>

                                <div className="pt-2 text-center text-sm">
                                    ¿Ya tienes cuenta?{" "}
                                    <a href="/login" className="font-medium">
                                        Inicia sesión
                                    </a>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

 // 'use client'
 // import {AppInput} from "@/widget/ui/AppInput";
 // import {Key, Mail, User} from "lucide-react";
 // import {PasswordInput} from "@/widget/ui";
 // import React, {useState} from "react";
 //
 // export default function RegisterPage() {
 //     const [email, setEmail] = React.useState("");
 //     const [pass, setPass] = React.useState("");
 //
 //     const [errors, setErrors] = React.useState<{ email?: string; pass?: string }>({});
 //
 //     const onSubmit = (e: React.FormEvent) => {
 //         e.preventDefault();
 //
 //         const next: typeof errors = {};
 //         if (!email.trim()) next.email = "El correo es obligatorio";
 //         if (!pass.trim()) next.pass = "La contraseña es obligatoria";
 //         if (pass && pass.length < 6) next.pass = "Mínimo 6 caracteres";
 //
 //         setErrors(next);
 //
 //         if (Object.keys(next).length === 0) {
 //              ✅ enviar login / registro
 //             console.log("OK");
 //         }
 //     };
 //
 //     return (
 //         <div className="relative min-h-screen overflow-hidden bg-bg text-fg">
 //             {/* Background decor */}
 //             <div className="pointer-events-none absolute inset-0">
 //                 <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
 //                 <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
 //                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
 //             </div>
 //
 //             <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
 //                 <div className="w-full overflow-hidden rounded-3xl bg-surface-2/70 shadow-2xl backdrop-blur-xl">
 //                     <div className="grid md:grid-cols-2">
 //                         {/* Left / Brand */}
 //                         <div className="relative hidden md:block">
 //                             <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_60%)]" />
 //                             <div className="relative flex h-full flex-col justify-between p-10">
 //                                 <div className="flex items-center gap-3">
 //                                     <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow">
 //                                         I
 //                                     </div>
 //                                     <div>
 //                                         <div className="text-sm font-semibold">Crear cuenta</div>
 //                                         <div className="text-sm text-muted-fg">Completa tus datos</div>
 //                                     </div>
 //                                 </div>
 //
 //                                 <div className="space-y-3">
 //                                     <p className="text-xl font-semibold leading-snug">
 //                                         Empieza a gestionar todo desde un solo lugar.
 //                                     </p>
 //                                     <p className="text-sm text-muted-fg">
 //                                         Registro rápido, seguridad y una experiencia moderna.
 //                                     </p>
 //
 //                                     <div className="mt-6 grid gap-3 text-sm">
 //                                         <div className="flex items-center gap-2 text-muted-fg">
 //                                             <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
 //                                                 ✓
 //                                             </span>
 //                                             Acceso en segundos
 //                                         </div>
 //                                         <div className="flex items-center gap-2 text-muted-fg">
 //                                             <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
 //                                                 ✓
 //                                             </span>
 //                                             Datos protegidos
 //                                         </div>
 //                                         <div className="flex items-center gap-2 text-muted-fg">
 //                       <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
 //                         ✓
 //                       </span>
 //                                             Interfaz limpia y rápida
 //                                         </div>
 //                                     </div>
 //                                 </div>
 //
 //                                 <div className="text-xs text-muted-fg">
 //                                     © {new Date().getFullYear()} Tu marca. Todos los derechos reservados.
 //                                 </div>
 //                             </div>
 //                         </div>
 //
 //                         {/* Right / Form */}
 //                         <div className="p-6 sm:p-10">
 //                             {/* Mobile header */}
 //                             <div className="mb-8 flex items-center gap-3 md:hidden">
 //                                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow">
 //                                     I
 //                                 </div>
 //                                 <div>
 //                                     <div className="text-sm font-semibold">Crear cuenta</div>
 //                                     <div className="text-sm text-muted-fg">Completa tus datos</div>
 //                                 </div>
 //                             </div>
 //
 //                             <div className="mb-6">
 //                                 <h1 className="text-2xl font-semibold tracking-tight">Regístrate</h1>
 //                                 <p className="mt-1 text-sm text-muted-fg">
 //                                     Crea tu cuenta para empezar.
 //                                 </p>
 //                             </div>
 //
 //                             <form onSubmit={onSubmit} className="space-y-4">
 //                                 <AppInput
 //                                     label="Nombre"
 //                                     placeholder="Ej: Juan Angel"
 //                                     leftIcon={<User size={18} />}
 //                                 />
 //
 //                                 <AppInput
 //                                     label="Correo"
 //                                     required
 //                                     value={email}
 //                                     onChange={(e) => setEmail(e.target.value)}
 //                                     error={errors.email}
 //                                 />
 //
 //                                 <PasswordInput
 //                                     label="Contraseña"
 //                                     required={true}
 //                                     value={pass}
 //                                     onChange={(e) => setPass(e.target.value)}
 //                                     error={errors.pass}
 //                                 />
 //
 //                                 <AppInput
 //                                     label="Solo lectura"
 //                                     readOnly
 //                                     value="No editable"
 //                                 />
 //
 //                                 <AppInput
 //                                     label="Bloqueado"
 //                                     disabled
 //                                 />
 //
 //                                 {/* Terms */}
 //                                 <label className="flex items-start gap-2 text-sm text-muted-fg">
 //                                     <input
 //                                         type="checkbox"
 //                                         className="mt-1 h-4 w-4 rounded border-border bg-bg/50 text-primary focus:ring-primary/20"
 //                                     />
 //                                     <span>
 //                                         Acepto los{" "}
 //                                         <a className="text-primary hover:underline" href="#">
 //                                           términos
 //                                         </a>{" "}
 //                                         y la{" "}
 //                                         <a className="text-primary hover:underline" href="#">
 //                                           política de privacidad
 //                                         </a>
 //                                         .
 //                                     </span>
 //                                 </label>
 //
 //                                 <button
 //                                     type="submit"
 //                                     className="bg-brand-orange text-danger-fg px-4 py-2 rounded-xl hover:opacity-90 transition"
 //                                         >
 //                                     Registrarme
 //                                     <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
 //                                 </button>
 //
 //                                 <div className="pt-2 text-center text-sm text-muted-fg">
 //                                     ¿Ya tienes cuenta?{" "}
 //                                     <a href="/login" className="font-medium text-primary hover:underline">
 //                                         Inicia sesión
 //                                     </a>
 //                                 </div>
 //                             </form>
 //                         </div>
 //                     </div>
 //                 </div>
 //             </div>
 //         </div>
 //     );
 // }