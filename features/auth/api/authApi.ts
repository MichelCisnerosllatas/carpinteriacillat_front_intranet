// src/features/auth/api/authApi.ts
//Este archivo depende de shared/api/base.ts

import {clienteAPI} from "@/shared/api/v1/base";
import { API_CONFIG } from '@/shared/api/v1/config';
import {AuthDataEntities, AuthResponseEntities} from "@/entity/auth/authDataEntities"
import {ApiResponse} from "@/shared/types/api";

// import {ApiResult, UserAuthData} from "@/entities/auth/model/types";

export const authApi = {
    // ============================================
    // Login - API manual, sin connexion con la base.ts ni config.ts, esto es la forma correcta de
    // de acceder a una api cruda, esto es para appcorbanza
    // ============================================
    // login: async (email: string, password: string): Promise<ApiResult<UserAuthData>> => {
    //     const respuesta: any = await clienteAPI['cliente'].post(
    //         "https://appcobranza.com/Sistema_Cobranza/Controller/UsuarioController.php",
    //         new URLSearchParams({
    //             Accion: "5",
    //             Login: email,
    //             Clave: password,
    //         }),
    //         {
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //         }
    //     );
    //
    //     // Aquí extraes el objeto real que cumple la interfaz ApiResult<UserAuthData>
    //     return respuesta as ApiResult<UserAuthData>;
    // },



    // ============================================
    // Login - Iniciar sesión CON BHASE.TS Y CONFIG.TS
    // ============================================
    login: async (email: string, password: string): Promise<ApiResponse<AuthResponseEntities>> => {
        const respuesta = await clienteAPI.enviarFormulario<ApiResponse<AuthResponseEntities>>(
            API_CONFIG.endpoints.auth.login, {
                email: email,
                password: password
            }
        );

        return respuesta; // 👈 Devuelves todo el result
    },
    // login: async (email: string, password: string): Promise<UserAuthData> => {
    //     const resultado = await clienteAPI.enviarFormulario<UserAuthData>(API_CONFIG.endpoints.auth.login, {
    //         Accion: '5', // Acción específica de tu API
    //         Login: email,
    //         Clave: password,
    //     });
    //     return resultado;
    // },

    // ============================================
    // Logout - Cerrar sesión (si tu API lo requiere)
    // ============================================
    logout: async (): Promise<void> => {
        await clienteAPI.enviarFormulario(
            API_CONFIG.endpoints.auth.logout,
            {
                Accion: 'logout',
            }
        );
    },

    // ============================================
    // Verificar token - Validar sesión actual
    // ============================================
    verificarToken: async (token: string): Promise<AuthDataEntities> => {
        const resultado = await clienteAPI.enviarFormulario<AuthDataEntities>(API_CONFIG.endpoints.auth.verify, {
            Accion: 'verify',
            token: token,
        });

        return resultado;
    },

    // ============================================
    // Registro - Crear nueva cuenta (opcional)
    // ============================================
    registro: async (datos: {
        nombre: string;
        email: string;
        password: string;
    }): Promise<AuthDataEntities> => {
        const resultado = await clienteAPI.enviarFormulario<AuthDataEntities>(API_CONFIG.endpoints.auth.register, {
            Accion: 'registro',
            Nombre: datos.nombre,
            Email: datos.email,
            Password: datos.password,
        });

        return resultado;
    },

    // ============================================
    // Recuperar contraseña (opcional)
    // ============================================
    recuperarPassword: async (email: string): Promise<void> => {
        await clienteAPI.enviarFormulario(API_CONFIG.endpoints.auth.forgotpassword, {
            Accion: 'recuperar_password',
            Email: email,
        });
    },
}