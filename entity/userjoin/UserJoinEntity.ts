//entity/userjoin/UserJoinEntity.ts
import {RoleEntity} from "@/entity/Role/RoleEntity";

export interface UserJoinEntity{
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role : RoleEntity | null;
}