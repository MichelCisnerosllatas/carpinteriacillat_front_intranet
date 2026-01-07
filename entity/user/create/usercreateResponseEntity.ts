//entity/user/create/usercreateResponseEntity.ts
export interface UsercreateResponseEntity {
    success: true,
    status: 201,
    message: "user creada",
}

export interface UserCreateDataResponseEntity {
    id: number | string,
    role_id: string | null,
    name: string | null,
    email: string | null,
    email_verified_at: string | null,
    created_at: string | null,
    updated_at: string | null,
}