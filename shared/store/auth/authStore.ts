// Archivo: src/shared/store/authStore.ts
import {create} from "zustand/index";
import {authApi} from "@/features/auth/api/authApi";
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import {toast} from "react-hot-toast";
import {AuthDataEntitys} from "@/entity/auth/register/RegisterEntity";
import {getTokenDevicePayload, getTokenDevicePayloadPro} from "@/shared/lib/device/getTokenDevicePayload";
import {TokenDeviceApi} from "@/features/tokendevice/api/TokenDeviceApi";

type AuthStore = {
    usuario: AuthDataEntitys | null;
    access_token_id: string;
    loadinauth: boolean;
    estaLogueado: boolean;
    success: boolean | null;
    error: string | null;

    iniciarSesion: (email: string, password: string) => Promise<boolean>;
    cerrarSesion: () => Promise<boolean>;
    verificarSesion: () => Promise<string>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            usuario: null,
            loadinauth: false,
            estaLogueado: false,
            success: null,
            error: null,
            access_token_id: "",

            iniciarSesion: async (email: string, password: string)  => {
                try{
                    set({
                        loadinauth: true,
                        error: null
                    });

                    const respuesta = await authApi.login(email, password);
                    if (Number(respuesta.status) !== 200) {
                        throw new Error(respuesta.message || "Credenciales inválidas");
                    }

                    const datosUsuario = respuesta.data;
                    if(datosUsuario === null){
                        throw new Error(respuesta.message);
                    }

                    // Guarda token y usuario en cookies
                    localStorage.setItem("user", JSON.stringify(datosUsuario));
                    const token = respuesta.data?.token?.toString();
                    if (!token) {
                        throw new Error("No llegó token en la respuesta");
                    }

                    Cookies.set("token", token, {
                        expires: 7,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                    });


                    // Cookies.set('userjoin', JSON.stringify(datosUsuario), { expires: 7, secure: true })
                    Cookies.set(
                        'user',
                        JSON.stringify({
                            id: datosUsuario?.user?.id,
                            role_id: datosUsuario?.user?.role?.id,
                            // rol: datosUsuario.groups[0].name,
                        }),
                        {
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "strict",
                            expires: 7,
                        }
                    );

                    const payload = await getTokenDevicePayloadPro();
                    const syncRes = await TokenDeviceApi.synchronousApi(payload);
                    if (syncRes.success){
                        Cookies.set("access_token_id", String(syncRes.data?.access_token_id) ?? '', {
                            expires: 7,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "strict",
                        });
                        toast.success(`Bienvenido ${datosUsuario?.user?.person?.person_name}`);

                        set({
                            access_token_id: String(syncRes.data?.access_token_id) ?? '',
                            usuario: datosUsuario,
                            estaLogueado: true,
                            loadinauth: false,
                        });
                        return true;
                        // localStorage.setItem('tokendevice_row_id', String(syncRes.data?.device_row_id ?? ''))
                    }else{
                        toast.error("Hubo un error al Obtener el Info del dispositivo");
                        return false;
                    }
                }
                catch (ex: any) {
                    set({
                        error: ex.message || "Error al iniciar sesión",
                        loadinauth: false,
                        estaLogueado: false,
                        usuario: null,
                    });
                    return false;
                }
            },
            cerrarSesion: async (): Promise<boolean> => {
                try {
                    await TokenDeviceApi.revokeSyncApi(get().access_token_id);
                    await authApi.logout();
                    return true;
                } catch (e) {
                    return false;
                }
            },

            // cerrarSesion: () => {
            //     localStorage.removeItem('user');
            //     Cookies.remove('token');
            //     Cookies.remove('user');
            //     resetAllStores();
            //     set({
            //         usuario: null,
            //         estaLogueado: false,
            //         error: null,
            //     });
            //
            //     // Swal.fire({
            //     //     icon: 'info',
            //     //     title: 'Sesión cerrada',
            //     //     timer: 1000,
            //     //     showConfirmButton: false,
            //     // }).then(() => {
            //     //     window.location.href = '/login'
            //     // })
            // },
            verificarSesion: async () => {
                const token = Cookies.get('token');
                const userData = localStorage.getItem('user');

                // Comienza cargando
                set({ loadinauth: true });

                // Si no hay token ni usuario, limpiar sesión y devolver ruta login
                if (!token || !userData) {
                    set({
                        usuario: null,
                        estaLogueado: false,
                        loadinauth: false,
                    });
                    return '/login';
                }

                try {
                    // Si hay datos en localStorage, restaurarlos
                    const usuario = JSON.parse(userData);

                    set({
                        usuario,
                        estaLogueado: true,
                        loadinauth: false,
                    });

                    return '/dashboard';
                } catch (error) {
                    // Si localStorage tiene datos corruptos o inválidos
                    Cookies.remove('token');
                    localStorage.removeItem('user');
                    set({
                        usuario: null,
                        estaLogueado: false,
                        loadinauth: false,
                    });
                    return '/login';
                }
            },
            reset: () => set({
                usuario: null,
                loadinauth: false,
                estaLogueado: false,
                success: null,
                error: null,
                access_token_id: ''
            }),
        }),
        {
            // CONFIGURACIÓN DE PERSIST
            name: 'auth-storage', // Nombre en localStorage

            // Guardar TODOS los datos excepto el token (por seguridad)
            partialize: (state) => ({
                usuario: state.usuario,           // ← TODOS los datos del usuario
                estaLogueado: state.estaLogueado,
                // NO guardar: cargando, error (son temporales)
                // NO guardar: token (va en cookies por seguridad)
            }),
        }
    )
)