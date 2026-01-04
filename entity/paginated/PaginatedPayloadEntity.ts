//entity/paginated/PaginatedPayloadEntity.ts
import { LinksEntity } from "@/entity/paginated/LinksEntity";
import { MetaEntity } from "@/entity/paginated/MetaEntity";

export interface PaginatedPayloadEntity<TItem> {
    data: TItem[];
    links: LinksEntity;
    meta: MetaEntity;
}
