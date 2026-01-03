//entity/auth/register/registerApiEntity.ts

export interface AuthDataEntitys {
    user: UserdataEntitys | null,
    token: string | null,
    token_type : string | null,
}

export interface UserdataEntitys {
    id: number | string | null,
    name: string | null,
    email: string | null,
    role: roleEntitys | null,
}

export interface roleEntitys {
    id: number | string | null,
    name: string | null,
    description: string | null,
    status: number | string | null,
}