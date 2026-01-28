"use client";
import {useUserListJoinStore} from "@/shared/store/user/UserListJoinStore";
import SinRegistro from "@/widget/intranet/SinRegistro";
import UserTablePagination from "@/features/users/ui/UserTablePagination";
import {Edit2, Eye, Trash2 } from "lucide-react";
import UserTableModalMenu from "@/widget/user/UserTableModalMenu";
import {useRouter} from "next/navigation";

export default function UserTable(){
    const {items, page, per_page, fetch} = useUserListJoinStore();
    const route = useRouter();

    const handleRetry = async () => {
        useUserListJoinStore.setState({ isLoaded: false });
        await fetch();
        // window.location.reload();
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("¿Deseas eliminar este registro?")) {
            // Aquí puedes eliminar del store si lo manejas desde zustand
            // Por ahora, solo mostramos confirmación
            alert(`Registro con id ${id} eliminado`);
        }
    };

    const handleClick = (item: any) => {
        const encoded = encodeURIComponent(JSON.stringify(item));
        // router.push(`/disponibilidadhoraria/${item.id}?data=${encoded}`);
    };

    // const abrirVistaDetalles = (periodo: PeriodosGestionListEntities) => {
    //     // Lógica para abrir la vista de detalles del periodo de gestión
    //     // router.push(`/detalleperiodo?id=${periodo.id}&data=${btoa(JSON.stringify(periodo))}`);
    //     // console.log("Abrir detalles para el periodo:", periodo);
    // }

    const noData = !items || items.length === 0;
    return(
        <>
            {noData ? (
                <SinRegistro onButtonClick={handleRetry}/>
            ) : (
                <table className="min-w-full text-sm mt-2">
                    <thead>
                        <tr className="text-left bg-surface border-b bg-surface-2">
                            <th className="py-3 px-4">N°</th>
                            <th className="py-3 px-4 hidden">ID</th>
                            <th className="py-3 px-4">Nombre Completo</th>
                            <th className="py-3 px-4">Rol</th>
                            <th className="py-3 px-4">Correo</th>
                            <th className="py-3 px-4 text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} className="border-b hover:bg-bg transition">
                                <td className="py-3 px-4 align-top">{(page - 1) * per_page + index + 1}</td>
                                <td className="py-3 px-4 align-top hidden">{item.id}</td>
                                <td className="py-3 px-4 align-top">{item.person?.person_name} {item.person?.person_lastname}</td>
                                <td className="py-3 px-4 align-top">{item.role?.role_name}</td>
                                <td className="py-3 px-4 align-top">{item.email}</td>
                                <td className="py-3 px-4 flex justify-end items-center gap-2">
                                    <button onClick={() => {}} className="text-muted hover:text-blue-600 transition-colors cursor-pointer" title="Editar / Ver detalles">
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => {
                                        route.push(`/user/edit?id=${item.id}`);
                                    }} className="text-muted hover:text-blue-600 transition-colors cursor-pointer" title="Editar / Ver detalles">
                                        <Edit2 size={18} />
                                    </button>
                                    {/*<button className="text-muted hover:text-blue-600 transition-colors cursor-pointer" title="Descargar">*/}
                                    {/*    <Download size={18} />*/}
                                    {/*</button>*/}
                                    <button onClick={() => {}} className="text-muted hover:text-red-600 transition-colors cursor-pointer" title="Eliminar">
                                        <Trash2 size={18} />
                                    </button>
                                    <UserTableModalMenu periodo={item}/>
                                    {/*<button className="text-muted hover:text-blue-600 transition-colors cursor-pointer" title="Configurar">*/}
                                    {/*    <Settings size={18} />*/}
                                    {/*</button>*/}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                </table>
            )}


            {/*validacion de la paginacion cuando hay registro*/}
            { noData ? ( <div></div> ) : (<UserTablePagination/>)}
        </>
    );
}