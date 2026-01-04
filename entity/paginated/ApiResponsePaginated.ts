//entity/paginated/ApiResponsePaginated.ts
import { LinksEntity } from "@/entity/paginated/LinksEntity";
import { MetaEntity } from "@/entity/paginated/MetaEntity";

export interface ApiResponsePaginated<TItem> {
    success: boolean;
    status: number;
    message: string;
    data: TItem[];
    links: LinksEntity;
    meta: MetaEntity;
    errors?: Record<string, string[]> | null;
}
