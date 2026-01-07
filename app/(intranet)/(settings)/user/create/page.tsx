'use client';
import {HeaderNavegacion} from "@/widget/intranet/HeaderNavegacion";
import {getTokenDevicePayloadPro} from "@/shared/lib/device/getTokenDevicePayload";
import UserForm from "@/features/users/ui/mantuser/UserForm";

export default function page() {

    // Definimos los breadcrumbs
    const misBreadcrumbs = [
        { label: 'Usuarios', href: '/user' },
        { label: 'Crear Usuario' },
    ];

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            <HeaderNavegacion
                title="Crear Usuario"
                description="Complete la información requerida para registrar un nuevo colaborador en la plataforma. Los campos marcados son obligatorios."
                breadcrumbs={misBreadcrumbs}
                actions={
                    // Aquí pasamos lo que queremos que flote a la derecha
                    <div className="flex space-x-3">
                        <button
                            onClick={async () => {
                                const payload = await getTokenDevicePayloadPro()
                                alert(
                                    "Payload de dispositivo:\n" +
                                    JSON.stringify(payload, null, 2)
                                )
                            }}

                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Guía de Ayuda
                        </button>
                        {/* Podríamos poner un botón secundario aquí si quisieramos */}
                    </div>
                }
            />

            <UserForm/>
        </div>
    );
}