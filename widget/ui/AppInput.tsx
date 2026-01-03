//widget/ui/AppInput.tsx
'use client'
import * as React from "react";

type AppInputProps = {
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AppInput({
                             label,
                             error,
                             required,
                             disabled,
                             readOnly,
                             leftIcon,
                             rightIcon,
                             className,
                             ...props
                         }: AppInputProps) {
    const hasError = !!error;

    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm font-medium text-fg">
                    {label}
                    {required && <span className="ml-1 text-danger">*</span>}
                </label>
            )}

            <div
                className={[
                    "relative flex items-center gap-2 rounded-xl border px-3 py-2 bg-surface transition",
                    // borde normal / error
                    hasError ? "border-danger" : "border-border",

                    // ✅ focus SOLO borde (y opcional un ring suave)
                    // si hay error, el focus sigue rojo
                    !disabled && !readOnly && (
                        hasError
                            ? "focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/25"
                            : "focus-within-border-yellow focus-within:ring-2 focus-within:ring-[hsl(var(--brand-yellow)/.35)]"
                    ),

                    // estados
                    disabled ? "opacity-60 cursor-not-allowed" : "",
                    readOnly ? "bg-surface-2" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {leftIcon && <span className="text-muted-fg">{leftIcon}</span>}

                <input
                    {...props}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-invalid={hasError}
                    className={[
                        "w-full bg-transparent outline-none text-fg placeholder:text-muted-fg",
                        // ✅ cursor correcto
                        disabled ? "cursor-not-allowed" : "cursor-text",
                        readOnly ? "cursor-default" : "",
                        // texto disabled
                        disabled ? "text-muted-fg" : "",
                        className ?? "",
                    ].join(" ")}
                />

                {rightIcon}
            </div>

            {/* ✅ error SIEMPRE rojo */}
            {hasError && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
}