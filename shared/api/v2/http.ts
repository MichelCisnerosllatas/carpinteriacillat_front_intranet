//shared/api/v2/http.ts
import axios from 'axios'
import {tokenStorage} from "@/features/auth/storage/token.storage";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
})

/* REQUEST INTERCEPTOR */
http.interceptors.request.use((config) => {
    const token = tokenStorage.get()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/* RESPONSE INTERCEPTOR */
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenStorage.remove()

            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)
