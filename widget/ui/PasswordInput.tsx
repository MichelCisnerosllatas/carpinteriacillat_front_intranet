"use client";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { AppInput } from "./AppInput";

type PasswordInputProps = Omit<
    React.ComponentProps<typeof AppInput>,
    "type" | "rightIcon"
>;

export function PasswordInput({
                                  disabled,
                                  readOnly,
                                  ...props
                              }: PasswordInputProps) {
    const [show, setShow] = React.useState(false);

    const blocked = !!disabled || !!readOnly;

    return (
        <AppInput
            {...props}
            disabled={disabled}
            readOnly={readOnly}
            type={show ? "text" : "password"}
            rightIcon={
                <button
                    type="button"
                    onClick={() => {
                        if (blocked) return;
                        setShow(v => !v);
                    }}
                    disabled={blocked}
                    tabIndex={blocked ? -1 : 0}
                    aria-disabled={blocked}
                    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className={[
                        "grid place-items-center rounded-lg pr-2 text-muted-fg",
                        blocked
                            ? "cursor-not-allowed opacity-60"
                            : "hover:bg-surface-2 cursor-pointer",
                    ].join(" ")}
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            }
        />
    );
}
