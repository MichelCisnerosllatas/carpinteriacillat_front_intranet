//features/auth/api/v2/authApi.ts
// features/auth/api/v2/authApi.ts
import { http } from '@/shared/api/v2/http'
import { AUTH_ENDPOINTS } from './authEndpoints'
import {loginRequestDto, loginResponseDto} from "@/shared/contracts/auth/login.dto";

export const authApi = {
    login: async (payload: loginRequestDto): Promise<loginResponseDto> => {
        const { data } = await http.post<loginResponseDto>(
            AUTH_ENDPOINTS.login,
            payload
        )
        return data
    },
}
