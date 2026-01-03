// Archivo: /shared/api/config.ts
export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    configs: {
        default: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        json:    { headers: { 'Content-Type': 'application/json' } },
        formData:{ headers: { 'Content-Type': 'multipart/form-data' } },
    },
  
    // Endpoints específicos
    endpoints: {
        auth: {
            login: '/intranet/auth/login',
            logout: '/intranet/auth/logout/',
            register: '/intranet/auth/register',
            verify: '/UsuarioController.php',
            forgotpassword: '/auth/users/recovery-user/',
        }
    }
} as const;