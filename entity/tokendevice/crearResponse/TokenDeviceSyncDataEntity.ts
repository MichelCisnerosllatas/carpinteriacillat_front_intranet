//entity/tokendevice/crearResponse/TokenDeviceSyncDataEntity.ts
export interface TokenDeviceSyncDataEntity {
    access_token_id: string | null;
    device_row_id: number | string | null;
    last_used_at: string | null;
}