//page/(intranet)/(settings)/user/user-page-client.tsx
'use client';
import {ModuleHeader} from "@/widget/intranet/ModuleHeader";
import {AppInput} from "@/widget/ui";
import { AppButton } from "@/widget/ui/AppButton";
import {useEffect, useState} from "react";
import {ArrowRight} from "lucide-react";
import UserTable from "@/features/users/ui/UserTable";
import {useUserListJoinStore} from "@/shared/store/user/UserListJoinStore";
import CirculeProgress from "@/widget/intranet/CirculeProgress";

export default function UserPageClient(){
    const {isLoaded,loading, fetch} = useUserListJoinStore();
    const [openModal, setOpenModal] = useState(false);

    const handleAdd = () => {};

    useEffect(() => {
        if (!isLoaded) {
            fetch().then();
        }
    }, [isLoaded, fetch]);

    const showInitialLoader = !isLoaded && (loading || !isLoaded);
    return(
        <>
            <ModuleHeader
                title="Usuarios"
                description="Gestión de Usuarios registrados en el sistema"
                addLabel="Nuevo Usuario"
                onAdd={handleAdd}
                filters={
                    <>
                        <AppInput
                            onChange={async (e) => {
                                await fetch({
                                    search: e.target.value
                                });
                            }}
                            type="text"
                            placeholder="Buscar..."
                        />

                        <select className="input">
                            <option value="">Estado</option>
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>

                        <select className="input">
                            <option value="">Tipo</option>
                            <option value="natural">Natural</option>
                            <option value="empresa">Empresa</option>
                        </select>


                    </>
                }
            />

            {showInitialLoader ? (
                <CirculeProgress />
            ) : (
                <UserTable />
            )}

            {/*<AppButton variant="primary" rightIcon={<ArrowRight size={16} />}>*/}
            {/*    Registrarme*/}
            {/*</AppButton>*/}

            {/*<AppButton variant="danger" loading>*/}
            {/*    Eliminando...*/}
            {/*</AppButton>*/}

            {/*<AppButton variant="secondary" disabled>*/}
            {/*    Deshabilitado*/}
            {/*</AppButton>*/}



        </>
    );
}