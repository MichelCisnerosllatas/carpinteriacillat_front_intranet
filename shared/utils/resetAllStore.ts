import Cookies from 'js-cookie';
import { useAuthStore } from "@/shared/store/auth/authStore";
// import { usehistoriadisponibilidadListStore } from "@/shared/store/disponiblidadhoraria/historiadisponibilidad/hisoriadisponibilidadListStore";
// import {usedisponibilidadhorariaDeleteStore} from "@/shared/store/disponiblidadhoraria/disponiblidadhorariaDeleteStore";
// import {usedisponibilidadhorariaModalStore} from "@/shared/store/disponiblidadhoraria/disponiblidadhorariaModalStore";
// import {usedisponibilidadhorariaFormStore} from "@/shared/store/disponiblidadhoraria/disponiblidadhorariaFormStore";

export const resetAllStores = () => {
    console.log("🧹 Limpiando todos los stores y storages...");

    // 1. Resetear stores Zustand
    // usehistoriadisponibilidadListStore.getState().reset();
    // usedisponibilidadhorariaDeleteStore.getState().reset();
    // usedisponibilidadhorariaModalStore.getState().reset();
    // usedisponibilidadhorariaFormStore.getState().reset();
    // ... agrega los otros stores que tengas

    // 2. Limpiar storages del navegador
    // localStorage.clear();
    // sessionStorage.clear();

    // 3. Limpiar cookies
    Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
    });

    console.log("✅ Todos los stores y datos fueron limpiados.");
};
