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
        v1: {
            auth: {
                login: '/intranet/auth/login',
                logout: '/intranet/auth/logout/',
                register: '/intranet/auth/register',
                verify: '/UsuarioController.php',
                forgotpassword: '/auth/users/recovery-userjoin/',
            },
            tokedevice : {
                sync: '/intranet/auth/token-device/sync',
                revoke: '/intranet/auth/token-device/revoke'
            },
            users : {
                getUsersJoin: '/intranet/user/listjoin',
                create: "/intranet/user"
            }
        }
    }
} as const;