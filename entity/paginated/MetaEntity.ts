//entity/paginated/MetaEntity.ts
import {LinksMetaEntity} from "@/entity/paginated/LinksMetaEntity";

export interface MetaEntity  {
    current_page: number | null;
    from: number | null;
    links : LinksMetaEntity[];
    last_page: number | null;
    path: string | null;
    per_page: number | null;
    to: number | null;
    total: number | null;
}