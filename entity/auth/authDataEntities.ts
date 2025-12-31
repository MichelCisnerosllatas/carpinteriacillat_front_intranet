//src/entities/auth/authentities.ts;

export interface AuthResponseEntities {
    message: string | null;
    data: AuthDataEntities | null;
    token: string | null;
    token_type: string | null;
}


// Estructura del data
export interface AuthDataEntities {
    id: number | string | null;
    role_id: number | string | null;
    name: string | null;
    email: string | null;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
}