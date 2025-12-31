// ============================================
// base.ts - USANDO la configuración de config.ts
// ============================================

// Archivo: src/shared/api/base.ts

import axios, {AxiosInstance, AxiosResponse} from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from './config';

class ClienteAPI {
    private cliente: AxiosInstance;

    constructor() {
        this.cliente = axios.create({
            baseURL: API_CONFIG.baseURL,
            timeout: 30000,
            headers: API_CONFIG.configs.default.headers,
        });

        this.configurarInterceptores();
    }

    private configurarInterceptores() {
        // Request interceptor
        this.cliente.interceptors.request.use(
            (config) => {
                const token = Cookies.get('token');
                if (token) {
                    // config.headers.Authorization = `Bearer ${token}`;
                    config.headers.Authorization = `Token ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor (mejorado para diferentes formatos)
        this.cliente.interceptors.response.use(
            (respuesta) => {
                return respuesta;
                // return respuesta.data; // devolvemos TODO el cuerpo del backend sin alterar
            },
            (error) => {
                if (!error.response) {
                    // Error de red, sin respuesta del servidor
                    return Promise.reject(
                        new Error(error.message || "Error de red o CORS.")
                    );
                }

                // 👇 Mantenemos el objeto original del error (NO lo convertimos en new Error)
                return Promise.reject(error);
            }
            // (error) => {
            //     if (!error.response) {
            //         return Promise.reject(
            //             new Error(error.message || 'Error de red o CORS.')
            //         );
            //     }
            //
            //     const mensaje =
            //         error.response.data?.result?.message ||
            //         error.response.data?.message ||
            //         error.message || 'Error desconocido.';
            //
            //     return Promise.reject(new Error(mensaje));
            // }
        );
    }



    // ============================================
    // MÉTODO 1: subirArchivo
    // ✅ Usa API_CONFIG.configs.formData.headers
    // ============================================

    async subirArchivo<T>(url: string, archivo: FormData): Promise<T> {
        // ✅ Usar headers de config.ts para FormData
        const respuesta = await this.cliente.post<T>(url, archivo, {
            headers: API_CONFIG.configs.formData.headers,
        });

        return respuesta as T;
    }

    // ============================================
    // MÉTODO 2: enviarJSON
    // ✅ Usa API_CONFIG.configs.json.headers
    // ============================================



    async enviarJSON<T>(url: string, datos?: Record<string, unknown>): Promise<T> {
        // ✅ Usar headers de config.ts para JSON
        const respuesta = await this.cliente.post<T>(url, datos, {
            headers: API_CONFIG.configs.json.headers,
        });

        return respuesta as T;
    }


    // ============================================
    // MÉTODO 3: enviarFormulario
    // ✅ Usa API_CONFIG.configs.default.headers
    // ============================================

    async enviarFormulario<T>(url: string, datos?: Record<string, string | number>): Promise<T> {
        const formulario = new URLSearchParams();

        if (datos) {
            for (const clave in datos) {
                formulario.append(clave, String(datos[clave]));
            }
        }

        // 👇 Aquí indicamos explícitamente que axios.post devolverá `T` (por el interceptor)
        const respuesta = await this.cliente.post<any, T>( url, formulario, {
            headers: API_CONFIG.configs.default.headers,
        });

        return respuesta;
    }


    // ============================================
    // MÉTODO 4: obtener (GET)
    // No necesita Content-Type especial
    // ============================================

    async obtener<T>(url: string, parametros?: Record<string, string | number>): Promise<T> {
        const respuesta = await this.cliente.get<any, T>(url, {
            params: parametros,
        });

        return respuesta;
    }

    async obtener1<T>(url: string, parametros?: Record<string, string | number>): Promise<AxiosResponse<T>> {
        const respuesta = await this.cliente.get<T>(url, {
            params: parametros,
        });

        return respuesta;
    }

    // ============================================
    // MÉTODO 5: actualizar (PUT con formulario)
    // ✅ Usa API_CONFIG.configs.default.headers
    // ============================================

    async actualizar<T>(url: string, datos?: Record<string, string | number>): Promise<T> {
        const formulario = new URLSearchParams();

        if (datos) {
            for (const clave in datos) {
                if (datos.hasOwnProperty(clave)) {
                    formulario.append(clave, String(datos[clave]));
                }
            }
        }

        // ✅ Usar headers de config.ts
        const respuesta = await this.cliente.put<T>(url, formulario, {
            headers: API_CONFIG.configs.default.headers,
        });

        return respuesta as T;
    }


    //MÉTODO 6 PATH
    async actualizarParcial<T>(url: string, datos?: Record<string, unknown>): Promise<T> {
        const respuesta = await this.cliente.patch<T>(url, datos, {
            headers: API_CONFIG.configs.json.headers,
        });
        return respuesta as T;
    }

    // ============================================
    // MÉTODO 7: eliminar (DELETE)
    // ============================================

    async eliminar<T>(url: string): Promise<T> {
        const respuesta = await this.cliente.delete<T>(url);
        return respuesta as T;
    }
}

export const clienteAPI = new ClienteAPI();

// ============================================
// EXPLICACIÓN: ¿Por qué así?
// ============================================

/*
-----------------------------------------
// En base.ts
async enviarFormulario() {
  return this.cliente.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'  ← Repetido
    }
  });
}

AHORA (✅ BUENO - Usa config.ts):
-----------------------------------------
// En base.ts
async enviarFormulario() {
  return this.cliente.post(url, data, {
    headers: API_CONFIG.configs.default.headers  ← De config.ts
  });
}

// En config.ts (un solo lugar)
configs: {
  default: {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
}

VENTAJA:
Si necesitas cambiar los headers, solo cambias config.ts
*/

// ============================================
// MAPEAMIENTO: Método → Configuración
// ============================================

/*
┌─────────────────────────────────────────────────┐
│    Método          →    Configuración           │
├─────────────────────────────────────────────────┤
│                                                  │
│  enviarFormulario  →  API_CONFIG.configs.default│
│  actualizar        →  API_CONFIG.configs.default│
│  enviarJSON        →  API_CONFIG.configs.json   │
│  subirArchivo      →  API_CONFIG.configs.formData│
│  obtener           →  (no necesita Content-Type) │
│  eliminar          →  (no necesita Content-Type) │
│                                                  │
└─────────────────────────────────────────────────┘
*/