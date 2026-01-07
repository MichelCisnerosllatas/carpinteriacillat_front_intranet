//feature/users/api/UserApi.ts
import { clienteAPI } from "@/shared/api/v1/base";
import { API_CONFIG } from "@/shared/api/v1/config";
import { handleApiError } from "@/shared/api/v1/handleApiError";
import { UserJoinEntity } from "@/entity/user/userjoin/UserJoinEntity";
import { ApiResponsePaginated } from "@/entity/paginated/ApiResponsePaginated";
import { cleanParams } from "@/shared/lib/cleanParams";
import {userCreateUserType} from "@/shared/types/user/userCreateUserType";
import {ApiResponse} from "@/shared/types/api";
import {UserCreateDataResponseEntity} from "@/entity/user/create/usercreateResponseEntity";

export const UserApi = {
    get_users_join: async (params?: Record<string, string | number>): Promise<ApiResponsePaginated<UserJoinEntity>> => {
        try {
            const safeParams = cleanParams(params);

            const raw = await clienteAPI.obtener1<ApiResponsePaginated<UserJoinEntity>>(
                API_CONFIG.endpoints.v1.users.getUsersJoin,
                safeParams
            );

            return raw.data;
        }
        catch (ex) {
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
    details_user: async (id: number) : Promise<ApiResponse<UserJoinEntity>> => {
        try {
            const api = API_CONFIG.endpoints.v1.users + '/' + id.toString();
            const result = await clienteAPI.obtener1<ApiResponse<UserJoinEntity>>(api);
            return result.data;
        }
        catch (ex) {
            return handleApiError(ex);
        }
    },
    create_user: async (params: userCreateUserType): Promise<ApiResponse<UserCreateDataResponseEntity>> => {
        try {
            const fd = new FormData();
            fd.append("name", params.name);
            fd.append("email", params.email);
            fd.append("password", params.password);
            fd.append("role_id", params.role_id);

            const r = await clienteAPI.enviarFormData<ApiResponse<UserCreateDataResponseEntity>>(
                API_CONFIG.endpoints.v1.users.create,
                fd
            );

            return r.data;
        } catch (ex) {
            return handleApiError<UserCreateDataResponseEntity>(ex);
        }
    },
    update: async (id: number, params: userCreateUserType) => {

    }

};
