// widget/ui/ModuleHeader.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";
import { AppButton } from "@/widget/ui/AppButton";

interface ModuleHeaderProps {
    title: string;
    description?: string;
    onAdd?: () => void;
    addLabel?: string;
    filters?: React.ReactNode;
    addVariant?: "primary" | "secondary" | "ghost" | "danger";
    addDisabled?: boolean;
    addLoading?: boolean;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  description,
  onAdd,
  addLabel = "Agregar",
  filters,
  addVariant = "primary",
  addDisabled = false,
  addLoading = false,
}) => {
    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-fg">{title}</h1>
                    {description && <p className="text-sm text-muted-fg">{description}</p>}
                </div>

                {onAdd && (
                    <AppButton
                        variant={addVariant}
                        onClick={onAdd}
                        leftIcon={<Plus size={18} />}
                        disabled={addDisabled}
                        loading={addLoading}
                        type="button"
                    >
                        {addLabel}
                    </AppButton>
                )}
            </div>

            {/* FILTROS */}
            {filters && (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filters}
                </div>
            )}
        </div>
    );
};
