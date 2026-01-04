// widget/intranet/HeaderNavegacion.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

// Reutilizamos la lógica de breadcrumbs aquí para tener todo junto
interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface HeaderNavegacionProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode; // Esto es lo que irá a la derecha
}

export const HeaderNavegacion = ({ title, description, breadcrumbs, actions }: HeaderNavegacionProps) => {
    return (
        <div className="bg-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-6 lg:py-2">

                {/* 1. NAVEGACIÓN (Breadcrumbs) - Arriba del todo, discreto */}
                {breadcrumbs && (
                    <nav className="flex mb-2" aria-label="Breadcrumb">
                        <ol className="flex items-center">
                            {breadcrumbs.map((item, index) => (
                                <li key={index}>
                                    <div className="flex items-center">
                                        {index > 0 && (
                                            <svg className="flex-shrink-0 h-4 w-4 text-gray-300 mx-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                            </svg>
                                        )}
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-900" aria-current="page">
                        {item.label}
                      </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {/* 2. AREA PRINCIPAL (Flexbox para separar Titulo de Acciones) */}
                <div className="md:flex md:items-center md:justify-between">

                    {/* IZQUIERDA: Título y Descripción */}
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-1 text-sm text-gray-500">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* DERECHA: Botones o Acciones (Se apilan en movil, se alinean en desktop) */}
                    {actions && (
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            {actions}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};