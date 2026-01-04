// features/users/ui/UserTablePagination.tsx
"use client";
import { Loader2 } from "lucide-react";
import { useUserListJoinStore } from "@/shared/store/user/UserListJoinStore";

export default function UserTablePagination() {
    const {
        fetch,
        links,
        meta,
        page,
        per_page,
        loadingPagination,
        changePage,
        setPerPage,
    } = useUserListJoinStore();

    const totalPages = meta?.last_page ?? 1;
    const total = meta?.total ?? 0;
    const hasPrev = Boolean(links?.prev);
    const hasNext = Boolean(links?.next);

    const getVisiblePages = (page: number, totalPages: number) => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pages.push(i);
        else {
            if (page <= 4) pages.push(1, 2, 3, 4, 5, "...", totalPages);
            else if (page >= totalPages - 3)
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            else pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-surface border-t gap-3">
            <div className="flex items-center gap-3 text-sm">
            <span>
              Mostrando{" "}
                <span className="font-semibold">
                    <select
                        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={per_page}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        disabled={loadingPagination}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                </span>{" "}
                registros de un total de <span className="font-semibold">{total}</span>
            </span>
            </div>

            <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end">
                <button
                    onClick={() => hasPrev && fetch({ page: page - 1 })}
                    disabled={!hasPrev || loadingPagination}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                        !hasPrev || loadingPagination
                            ? "bg-app text-gray-400 cursor-not-allowed"
                            : "bg-app cursor-pointer border border-app hover:bg-gray-100"
                    }`}
                >
                    Anterior
                </button>

                {getVisiblePages(page, totalPages).map((p, i) =>
                        p === "..." ? (
                            <span key={`page-${i}`} className="px-2 text-gray-400 select-none">
                              …
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => changePage(Number(p))}
                                disabled={loadingPagination}
                                className={`px-3 py-1 rounded-md text-sm transition border ${
                                    page === p
                                        ? "bg-blue-600 text-white border-blue-600 cursor-pointer"
                                        : "bg-app cursor-pointer border-app hover:bg-gray-100"
                                } ${loadingPagination ? "opacity-60 pointer-events-none" : ""}`}
                            >
                                {loadingPagination && page === p ? (
                                    <Loader2 className="animate-spin mx-auto" size={16} />
                                ) : (
                                    p
                                )}
                            </button>
                        )
                )}

                <button
                    onClick={() => hasNext && fetch({ page: page + 1 })}
                    disabled={!hasNext || loadingPagination}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                        !hasNext || loadingPagination
                            ? "bg-app text-gray-400 cursor-not-allowed"
                            : "bg-app cursor-pointer border border-app hover:bg-gray-100"
                    }`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

// "use client";
// import {Loader2} from "lucide-react";
// import {useUserListJoinStore} from "@/shared/store/user/UserListJoinStore";
//
// export default function UserTablePagination(){
//     const {listarUser, previous,count, totalPages, page, page_size, next, loadingPagination, cambiarPagina, setPageSize } = useUserListJoinStore();
//
//     const getVisiblePages = (page: number, totalPages: number) => {
//         const pages: (number | string)[] = [];
//
//         if (totalPages <= 7) {
//             for (let i = 1; i <= totalPages; i++) pages.push(i);
//         } else {
//             if (page <= 4) {
//                 pages.push(1, 2, 3, 4, 5, "...", totalPages);
//             } else if (page >= totalPages - 3) {
//                 pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//             } else {
//                 pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
//             }
//         }
//         return pages;
//     };
//
//     return(
//         <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-app-2 border-t gap-3">
//             {/* Izquierda: texto + select (responsive) */}
//             <div className="flex items-center gap-3 text-sm">
//             <span>
//               Mostrando
//                 <span className="font-semibold">{/* select reemplaza el número 10 dinámicamente */}
//                     <select
//                         className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={page_size}
//                         onChange={(e) => {
//                             const size = Number(e.target.value);
//                             setPageSize(size);
//                         }}
//                         disabled={loadingPagination}
//                     >
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                         <option value={20}>20</option>
//                         <option value={50}>50</option>
//                     </select>
//                 </span>   registros
//               de un total de <span className="font-semibold">{count}</span> registros
//             </span>
//             </div>
//
//             {/* Derecha: paginación */}
//             <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end">
//                 {/* Botón Anterior */}
//                 <button onClick={() => previous && listarUser({ page: page - 1 })}
//                         disabled={!previous || loadingPagination} className={`px-3 py-1 rounded-md text-sm font-medium ${
//                     !previous || loadingPagination ? "bg-app text-gray-400 cursor-not-allowed" : "bg-app cursor-pointer border border-app hover:bg-gray-100"
//                 }`}
//                 >
//                     Anterior
//                 </button>
//
//                 {/* Páginas visibles */}
//                 {getVisiblePages(page, totalPages).map((p, i) =>
//                     p === "..." ? (
//                         <span key={`curso-page-${i + 1}`}
//                               className="px-2 text-gray-400 select-none">…</span>
//                     ) : (
//                         <button
//                             key={p}
//                             onClick={() => cambiarPagina(Number(p))}
//                             disabled={loadingPagination}
//                             className={`px-3 py-1 rounded-md text-sm transition border ${
//                                 page === p
//                                     ? "bg-blue-600 text-white border-blue-600 cursor-pointer"
//                                     : "bg-app cursor-pointer border-app hover:bg-gray-100"
//                             } ${loadingPagination ? "opacity-60 pointer-events-none" : ""}`}
//                         >
//                             {loadingPagination && page === p ? (
//                                 <Loader2 className="animate-spin mx-auto" size={16} />
//                             ) : (
//                                 p
//                             )}
//                         </button>
//                     )
//                 )}
//
//                 {/* Botón Siguiente */}
//                 <button
//                     onClick={() => next && listarUser({ page: page + 1 })}
//                     disabled={!next || loadingPagination}
//                     className={`px-3 py-1 rounded-md text-sm font-medium ${
//                         !next || loadingPagination
//                             ? "bg-app text-gray-400 cursor-not-allowed"
//                             : "bg-app cursor-pointer border border-app hover:bg-gray-100"
//                     }`}
//                 >
//                     Siguiente
//                 </button>
//             </div>
//         </div>
//     );
// }