// widget/intranet/Breadcrumbs.tsx
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string; // Opcional, si no tiene href es la página actual
}

export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
    return (
        <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="inline-flex items-center">
                            {index > 0 && (
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            )}

                            {isLast || !item.href ? (
                                <span className="ml-1 text-gray-900 font-medium md:ml-2">
                  {item.label}
                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="ml-1 font-medium text-gray-700 hover:text-blue-600 md:ml-2 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};