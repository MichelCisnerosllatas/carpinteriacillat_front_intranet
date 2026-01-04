"use client";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import React from "react";

interface EmptyStateProps {
    imageSrc?: string;
    title?: string;
    description?: string;
    buttonText?: string | null;
    onButtonClick?: (() => void) | null;
    loading?: boolean;
}

export default function SinRegistro({
    imageSrc = "/img/nohaydata.png",
    title = "No hay registros disponibles",
    description = "Aún no se han encontrado disponibilidades registradas. Puedes intentar recargar la lista.",
    buttonText = "Reintentar",
    onButtonClick = null,
    loading = false,
}: EmptyStateProps) {
    return (
        <div className="w-full h-[calc(100vh-180px)] flex flex-col items-center justify-center py-16 text-center">
            <Image
                src={imageSrc}
                alt="Empty State"
                width={120}
                height={120}
                className="opacity-90 mb-4"
            />

            {/* Título */}
            <h2 className="text-lg font-semibold mb-1">
                {title}
            </h2>

            {/* Descripción */}
            <p className="text-gray-500 mb-6 text-sm max-w-sm">
                {description}
            </p>

            {/* Botón opcional */}
            {buttonText && onButtonClick && (
                <button
                    onClick={onButtonClick}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    {loading ? "Cargando..." : buttonText}
                </button>
            )}
        </div>
    );
}
