//features/tokendevice/api/TokenDeviceApi.ts
import {clienteAPI} from "@/shared/api/v1/base";
import { API_CONFIG } from '@/shared/api/v1/config';
import {ApiResponse} from "@/shared/types/api";
import {TokenDeviceRegisterProps} from "@/features/tokendevice/type/TokenDeviceRegisterProps";
import {TokenDeviceSyncDataEntity} from "@/entity/tokendevice/crearResponse/TokenDeviceSyncDataEntity";
import {handleApiError} from "@/shared/api/v1/handleApiError";

export const TokenDeviceApi = {
    synchronousApi: async (payload: TokenDeviceRegisterProps): Promise<ApiResponse<TokenDeviceSyncDataEntity>> => {
        try {
            const fd = new FormData();
            fd.append("platform", payload.platform);
            fd.append("device_type", payload.device_type);
            fd.append("device_id", payload.device_id);
            fd.append("device_name", payload.device_name);
            fd.append("os_name", payload.os_name);
            fd.append("os_version", payload.os_version);
            fd.append("browser_name", payload.browser_name);
            fd.append("browser_version", payload.browser_version);

            const raw = await clienteAPI.enviarFormData<ApiResponse<TokenDeviceSyncDataEntity>>(
                API_CONFIG.endpoints.v1.tokedevice.sync,
                fd
            );

            return raw.data;
        }
        catch (error) {
            return handleApiError<TokenDeviceSyncDataEntity>(error);
        }
    },
    revokeSyncApi: async (access_token_id: string):Promise<ApiResponse<void>> => {
        try{
            const fd = new FormData();
            fd.append("access_token_id", access_token_id);
            const result = await clienteAPI.enviarFormData<ApiResponse<void>>(
                API_CONFIG.endpoints.v1.tokedevice.revoke,
                fd
            );
            return result.data;
        }
        catch (error) {
            return handleApiError<void>(error);
        }

    }
}