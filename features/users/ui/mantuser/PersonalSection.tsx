// features/users/ui/mantuser/sections/PersonalSection.tsx
"use client";
import React from "react";
import type { FormState } from "@/features/users/ui/mantuser/UserForm";

type Props = {
    form: FormState;
    setField: (key: keyof FormState) => (e: React.ChangeEvent<any>) => void;
};

export function PersonalSection({ form, setField }: Props) {
    return (
        <div className="bg-surface p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6 border-b pb-4">Información Personal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombres</label>
                    <input
                        value={form.person_name}
                        onChange={setField("person_name")}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Apellidos</label>
                    <input
                        value={form.person_lastname}
                        onChange={setField("person_lastname")}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                        value={form.email}
                        onChange={setField("email")}
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
