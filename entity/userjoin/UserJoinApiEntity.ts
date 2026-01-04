//entity/userjoin/UserJoinApiEntity.ts
import {UserJoinEntity} from "@/entity/userjoin/UserJoinEntity";
import {MetaEntity} from "@/entity/paginated/MetaEntity";
import {LinksEntity} from "@/entity/paginated/LinksEntity";

export interface UserJoinApiEntity {
    success: boolean;
    status: number;
    message: string;
    data: UserJoinEntity[],
    links: LinksEntity,
    meta: MetaEntity
}