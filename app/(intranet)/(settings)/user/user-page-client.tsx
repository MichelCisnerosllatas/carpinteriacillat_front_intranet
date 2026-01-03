'use client';
import {ModuleHeader} from "@/widget/intranet/ModuleHeader";
import {AppInput} from "@/widget/ui";
import { AppButton } from "@/widget/ui/AppButton";
import { useState } from "react";
import {ArrowRight} from "lucide-react";

export default function UserPageClient(){
    const [openModal, setOpenModal] = useState(false);

    const handleAdd = () => {};

    return(
        <>
            <ModuleHeader
                title="Usuarios"
                description="Gestión de Usuarios registrados en el sistema"
                addLabel="Nuevo Usuario"
                onAdd={handleAdd}
                filters={
                    <>
                        <AppInput type="text" placeholder="Buscar..."/>

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

            <AppButton variant="primary" rightIcon={<ArrowRight size={16} />}>
                Registrarme
            </AppButton>

            <AppButton variant="danger" loading>
                Eliminando...
            </AppButton>

            <AppButton variant="secondary" disabled>
                Deshabilitado
            </AppButton>
        </>
    );
}