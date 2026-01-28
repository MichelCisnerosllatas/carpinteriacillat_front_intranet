// features/users/ui/mantuser/sections/ConfigSection.tsx
"use client";
import React from "react";
import type { FormState } from "@/features/users/ui/mantuser/UserForm";

type Props = {
    form: FormState;
    setField: (key: keyof FormState) => (e: React.ChangeEvent<any>) => void;
};

export function ConfigSection({ form, setField }: Props) {
    return (
        <div className="bg-surface p-6 rounded-xl shadow-sm">
            <h3 className="font-medium mb-4">Configuración</h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Usuario Activo</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.activo}
                            onChange={setField("activo")}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-600">Rol del Sistema</label>
                    <select
                        value={form.role_id}
                        onChange={setField("role_id")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1">Administrador</option>
                        <option value="2">Editor</option>
                        <option value="3">Usuario Estándar</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
