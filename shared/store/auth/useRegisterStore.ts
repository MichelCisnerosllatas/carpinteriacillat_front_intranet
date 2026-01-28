//store/auth/useRegisterStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import { authApi } from "@/features/auth/api/v1/authApi";
import { ApiResponse } from "@/shared/types/api";
import {AuthDataEntitys, UserdataEntitys} from "@/entity/auth/register/RegisterEntity";
import {toast} from "react-hot-toast";

// Lo que manda el form / endpoint
export type RegisterPayload = {
    name: string;
    role_id: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type RegisterState = {
    loading: boolean;
    apiError: string | null; // error general (arriba del form o toast)
    fieldErrors: Record<string, string[]> | null; // errores por campo (Laravel)
    clearFieldError: (field: string) => void;

    user: UserdataEntitys | null;
    token: string | null;
    token_type: string | null;

    register: (payload: RegisterPayload) => Promise<ApiResponse<AuthDataEntitys>>;
    clearErrors: () => void;
};

export const useRegisterStore = create<RegisterState>((set) => ({
    loading: false,
    apiError: null,
    fieldErrors: null,

    user: null,
    token: null,
    token_type: null,

    clearErrors: () => set({ apiError: null, fieldErrors: null }),
    // y en el create:
    clearFieldError: (field) => set((s) => {

        if (!s.fieldErrors?.[field]) return s;

        const next = { ...s.fieldErrors };
        delete next[field];

        // si ya no quedan errores, deja null
        return { fieldErrors: Object.keys(next).length ? next : null };
    }),

    register: async (payload) => {
        if (payload.password !== payload.password_confirmation) {
            const res: ApiResponse<AuthDataEntitys> = {
                success: false,
                status: 422,
                message: "Las contraseñas no coinciden.",
                data: undefined,
                errors: { password_confirmation: ["Las contraseñas no coinciden."] },
            };

            set({ apiError: res.message, fieldErrors: res.errors ?? null });
            return res;
        }

        set({ loading: true, apiError: null, fieldErrors: null });
        const res = await authApi.registro(payload);

        if (res.success && res.data) {
            if (typeof res.data.token === "string") {
                Cookies.set("token", res.data.token, {
                    expires: 7,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });
            }

            localStorage.setItem("user", JSON.stringify(res.data));
            const id = res.data.user?.id;
            const role_id = res.data.user?.role?.id;
            if (!id || !role_id) {
                console.warn("No llegó id o role_id en la respuesta de registro");
            }
            Cookies.set(
                'user',
                JSON.stringify({
                    id: id,
                    role_id: role_id
                }),
                {
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    expires: 7,
                }
            );
            set({
                loading: false,
                apiError: null,
                fieldErrors: null,
                user: res.data.user,
                token: res.data.token,
                token_type: res.data.token_type,
            });

            toast.success(`Bienvenido ${res.data.user?.name}`)
        } else {
            set({
                loading: false,
                apiError: res.message,
                fieldErrors: res.errors ?? null,
            });
        }

        return res;
    },
}));
