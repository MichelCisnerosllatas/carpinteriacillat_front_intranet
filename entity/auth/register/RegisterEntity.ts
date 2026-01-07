//entity/auth/register/registerApiEntity.ts

import {PersonEntity} from "@/entity/person/personEntity";
import {RoleEntity} from "@/entity/Role/RoleEntity";

export interface AuthDataEntitys {
    user: UserdataEntitys | null,
    token: string | null,
    token_type : string | null,
}

export interface UserdataEntitys {
    id: number | string | null;
    role_id: number | string | null;
    email: string | null;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    person: PersonEntity | null;
    role: RoleEntity | null;
}

// export interface UserdataEntitys {
//     id: number | string | null,
//     name: string | null,
//     email: string | null,
//     role: roleEntitys | null,
// }

// export interface roleEntitys {
//     id: number | string | null,
//     name: string | null,
//     description: string | null,
//     status: number | string | null,
// }