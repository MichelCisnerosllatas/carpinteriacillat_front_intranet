//entity/userjoin/UserJoinEntity.ts
import {RoleEntity} from "@/entity/Role/RoleEntity";
import {PersonEntity} from "@/entity/person/personEntity";

export interface UserJoinEntity{
    id: number;
    email: string | null;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    person: PersonEntity | null;
    role: RoleEntity | null;
    // id: number;
    // name: string;
    // email: string;
    // email_verified_at: string | null;
    // created_at: string;
    // updated_at: string;
    // role : RoleEntity | null;
}