//feature/users/api/UserApi.ts
import { clienteAPI } from "@/shared/api/v1/base";
import { API_CONFIG } from "@/shared/api/v1/config";
import { handleApiError } from "@/shared/api/v1/handleApiError";
import { UserJoinEntity } from "@/entity/userjoin/UserJoinEntity";
import { ApiResponsePaginated } from "@/entity/paginated/ApiResponsePaginated";
import { cleanParams } from "@/shared/lib/cleanParams";

export const UserApi = {
    get_users_join: async (params?: Record<string, string | number>): Promise<ApiResponsePaginated<UserJoinEntity>> => {
        try {
            const safeParams = cleanParams(params);

            const raw = await clienteAPI.obtener1<ApiResponsePaginated<UserJoinEntity>>(
                API_CONFIG.endpoints.users.getUsersJoin,
                safeParams
            );

            return raw.data;
        } catch (ex) {
            const err = handleApiError(ex);
            return {
                success: false,
                status: err.status,
                message: err.message,
                data: [],
                links: { first: null, last: null, prev: null, next: null },
                meta: {
                    current_page: null,
                    from: null,
                    links: [],
                    last_page: null,
                    path: null,
                    per_page: null,
                    to: null,
                    total: null,
                },
                errors: err.errors ?? null,
            };
        }
    },
};
