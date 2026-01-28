// features/users/ui/mantuser/sections/ActionsSection.tsx
"use client";
import React from "react";

type Props = {
    isEdit: boolean;
    isSaving: boolean;
    canSubmit: boolean;
};

export function ActionsSection({ isEdit, isSaving, canSubmit }: Props) {
    return (
        <div className="flex flex-col gap-3 pt-0">
            <button
                type="submit"
                disabled={!canSubmit || isSaving}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSaving ? "Guardando..." : isEdit ? "Actualizar Usuario" : "Guardar Usuario"}
            </button>
        </div>
    );
}
