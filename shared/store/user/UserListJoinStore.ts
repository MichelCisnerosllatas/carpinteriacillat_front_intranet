// //shared/store/user/UserListJoinStore.ts
import {UserJoinEntity} from "@/entity/user/userjoin/UserJoinEntity";
import {create} from "zustand";
import {UserApi} from "@/features/users/api/UserApi";
import {LinksEntity} from "@/entity/paginated/LinksEntity";
import {MetaEntity} from "@/entity/paginated/MetaEntity";

type State = {
    items: UserJoinEntity[];
    links: LinksEntity | null;
    meta: MetaEntity | null;

    page: number;
    per_page: number;

    search: string;
    loading: boolean;
    loadingPagination: boolean;

    error: string | null;
    isLoaded: boolean;
};

type Actions = {
    fetch: (params?: { page?: number; per_page?: number; search?: string }) => Promise<void>;
    fetchSilent: (params?: { page?: number; per_page?: number; search?: string }) => Promise<void>;
    setSearch: (value: string) => void;
    changePage: (page: number) => Promise<void>;
    setPerPage: (per_page: number) => Promise<void>;
    reset: () => void;
};

export const useUserListJoinStore = create<State & Actions>((set, get) => ({
    items: [],
    links: null,
    meta: null,

    page: 1,
    per_page: 15,

    search: "",
    loading: false,
    loadingPagination: false,

    error: null,
    isLoaded: false,

    fetch: async (params) => {
        const nextPage = params?.page ?? get().page;
        const nextPerPage = params?.per_page ?? get().per_page;
        const nextSearch = params?.search ?? get().search;

        const isPaginationCall = params?.page !== undefined || params?.per_page !== undefined;

        set(isPaginationCall ? { loadingPagination: true } : { loading: true });
        set({ error: null });

        try {
            const res = await UserApi.get_users_join({
                page: nextPage,
                per_page: nextPerPage,
                search: nextSearch,
            });

            if (res.success) {
                set({
                    items: res.data ?? [],
                    links: res.links,
                    meta: res.meta,

                    page: res.meta?.current_page ?? nextPage,
                    per_page: res.meta?.per_page ?? nextPerPage,

                    isLoaded: true,
                });
            } else {
                set({
                    items: [],
                    links: null,
                    meta: null,
                    error: res.message,
                    isLoaded: true,
                });
            }
        } finally {
            set({ loading: false, loadingPagination: false });
        }
    },

    fetchSilent: async (params) => {
        const nextPage = params?.page ?? get().page;
        const nextPerPage = params?.per_page ?? get().per_page;
        const nextSearch = params?.search ?? get().search;

        try {
            const res = await UserApi.get_users_join({
                page: nextPage,
                per_page: nextPerPage,
                search: nextSearch,
            });

            if (res.success) {
                set({
                    items: res.data ?? [],
                    links: res.links,
                    meta: res.meta,
                    page: res.meta?.current_page ?? nextPage,
                    per_page: res.meta?.per_page ?? nextPerPage,
                    isLoaded: true,
                });
            } else {
                // ✅ IMPORTANTE: en refresh silencioso NO borres items
                // solo registra error si quieres
                set({ error: res.message, isLoaded: true });
            }
        } catch {
            // si algo explota, tampoco borres items
        }
    },


    setSearch: (value) => set({ search: value }),

    changePage: async (page) => {
        set({ page, loadingPagination: true });
        await get().fetch({ page });
    },

    setPerPage: async (per_page) => {
        set({ per_page, page: 1, loadingPagination: true });
        await get().fetch({ page: 1, per_page });
    },

    reset: () =>
        set({
            items: [],
            links: null,
            meta: null,
            page: 1,
            per_page: 15,
            search: "",
            loading: false,
            loadingPagination: false,
            error: null,
            isLoaded: false,
        }),
}));

//
// interface State {
//     userJoinEntity: UserJoinEntity[];
//     page: number;
//     totalPages: number;
//     page_size: number;           // tamaño actual de pagina
//     count: number;               // total de registros (backend)
//     next: string | null;
//     previous: string | null;
//     search: string;
//     filter: string;
//     loadingList: boolean;
//     loadingPagination: boolean;
//     isLoaded: boolean;
// }
//
// interface Actions {
//     listarUser: (params?: Record<string, string | number>) => Promise<void>;
//     cambiarPagina: (page: number) => Promise<void>;
//     setSearch: (value: string) => void;
//     setFilter: (value: string) => void;
//     setPageSize: (size: number) => Promise<void>;
//     reset : () => void;
// }
//
// export const useUserListJoinStore = create<State & Actions>((set, get) => ({
//     userJoinEntity: [],
//     page: 1,
//     totalPages: 1,
//     page_size: 5,   // default
//     count: 0,
//     next: null,
//     previous: null,
//     search: "",
//     filter: "",
//     loadingList: false,
//     loadingPagination: false,
//     isLoaded: false,
//
//     listarUser: async (params = {}) => {
//         // Si la petición viene por cambio de paginación, usamos loadingPagination;
//         // si viene por refrescar o filtro usamos loadingList.
//
//         const isPaginationCall = !!(params.page || params.page_size);
//         if (isPaginationCall) set({ loadingPagination: true });
//         else set({ loadingList: true });
//
//         try {
//             const { search, filter, page_size } = get();
//             const response = await UserApi.get_users_join({
//                 // prioridad params -> store values
//                 page: params.page ?? get().page,
//                 page_size: params.page_size ?? page_size,
//                 search,
//                 filter,
//                 ...params,
//             });
//
//             if (response.success && response.data) {
//                 const d = response.data;
//                 const m = response.data.meta;
//                 set({
//                     userJoinEntity: d.data ?? [],
//                     page: Number(m?.page ?? get().page),
//                     totalPages: Number(m?.total_pages ?? get().totalPages),
//                     page_size: Number(m?.page_size ?? get().page_size),
//                     count: Number(m?.count ?? get().count),
//                     next: m?.next ? String(m?.next) : null,
//                     previous: m?.previous ? String(m?.previous) : null,
//                 });
//             } else {
//                 // en caso de error, dejar isLoaded true para evitar spinner infinito
//                 set({ userJoinEntity: [] });
//             }
//         }
//         finally {
//             if (isPaginationCall) set({ loadingPagination: false });
//             else set({ loadingList: false });
//             set({ isLoaded: true });
//         }
//     },
//     cambiarPagina: async (newPage: number) => {
//         // actualizo HorarioNuevoCliente.tsx antes para que la UI muestre el nuevo HorarioNuevoCliente.tsx (y el index calcule bien)
//         set({ loadingPagination: true, page: newPage });
//         try {
//             await get().listarUser({ page: newPage });
//         } finally {
//             set({ loadingPagination: false });
//         }
//     },
//     setSearch: (value) => set({ search: value }),
//     setFilter: (value) => set({ filter: value }),
//     setPageSize: async (size: number) => {
//         // al cambiar page_size, reseteamos a la página 1 y recargamos
//         set({ page_size: size, page: 1, loadingPagination: true });
//         try {
//             await get().listarUser({ page: 1, page_size: size });
//         } finally {
//             set({ loadingPagination: false });
//         }
//     },
//     reset: () => set({
//         userJoinEntity: [],
//         page: 1,
//         totalPages: 1,
//         page_size: 5,   // default
//         count: 0,
//         next: null,
//         previous: null,
//         search: "",
//         filter: "",
//         loadingList: false,
//         loadingPagination: false,
//         isLoaded: false,
//     }),
// }));
