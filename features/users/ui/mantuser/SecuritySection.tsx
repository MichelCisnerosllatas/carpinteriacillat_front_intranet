// features/users/ui/mantuser/sections/SecuritySection.tsx
"use client";
import React from "react";
import type { FormState } from "@/features/users/ui/mantuser/UserForm";

type Props = {
    form: FormState;
    setField: (key: keyof FormState) => (e: React.ChangeEvent<any>) => void;
    isEdit: boolean;
};

export function SecuritySection({ form, setField, isEdit }: Props) {
    const showMismatch = (form.password || form.password2) && form.password !== form.password2;

    return (
        <div className="bg-surface p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6 border-b pb-4">Seguridad</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Contraseña {isEdit ? "(opcional)" : ""}
                    </label>
                    <input
                        value={form.password}
                        onChange={setField("password")}
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Repetir Contraseña</label>
                    <input
                        value={form.password2}
                        onChange={setField("password2")}
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            {showMismatch ? <p className="mt-3 text-sm text-red-600">Las contraseñas no coinciden.</p> : null}
        </div>
    );
}
