import Cookies from 'js-cookie';
import { useAuthStore } from "@/shared/store/auth/authStore";

export const resetAllStores = () => {
    // console.log("🧹 Limpiando todos los stores y storages...");

    // 1. Resetear stores Zustand
    useAuthStore.getState().reset();

    // 2. Limpiar storages del navegador
    // localStorage.clear();
    // sessionStorage.clear();
    //
    // // 3. Limpiar cookies
    // Object.keys(Cookies.get()).forEach(cookieName => {
    //     Cookies.remove(cookieName);
    // });

    // console.log("✅ Todos los stores y datos fueron limpiados.");
};
