import { useState, useRef, useEffect, useLayoutEffect } from "react";
import {MoreVertical, Eye, Edit2, Trash2, Download, Settings, SchoolIcon} from "lucide-react";
import Link from "next/link";

interface PeriodoType {
    id: number;
}

export default function UserTableModalMenu({ periodo }: { periodo: PeriodoType }) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [openUp, setOpenUp] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setOpen((o) => !o);

    // 🔥 CALCULAR POSICIÓN DESPUÉS DEL RENDER
    useLayoutEffect(() => {
        if (open && buttonRef.current && menuRef.current) {
            requestAnimationFrame(() => {
                const btn = buttonRef.current!.getBoundingClientRect();
                const menu = menuRef.current!.getBoundingClientRect();

                const espacioAbajo = window.innerHeight - btn.bottom;
                const debeAbrirArriba = espacioAbajo < menu.height + 10;

                setOpenUp(debeAbrirArriba);

                setCoords({
                    top: debeAbrirArriba ? btn.top - menu.height - 8 : btn.bottom + 8,
                    left: btn.right - menu.width,
                });
            });
        }
    }, [open]);

    // Cerrar al hacer click afuera
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                !buttonRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        window.addEventListener("scroll", () => setOpen(false));
        return () => {
            document.removeEventListener("mousedown", handleClick);
            window.removeEventListener("scroll", () => setOpen(false));
        };
    }, []);

    return (
        <>
            <button
                ref={buttonRef}
                className="text-muted hover:text-blue-600 transition cursor-pointer"
                onClick={toggleMenu}
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    className="fixed z-[9999] w-44 bg-app-2 shadow-xl rounded-md border transition"
                    style={{
                        top: coords.top,
                        left: coords.left,
                    }}
                >
                    <Link
                        href={`/horarioacademico/configuracioncurso?idperiodo=${periodo.id}`}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-500 w-full text-left cursor-pointer"
                        onClick={() => setOpen(false)}
                    >
                        <Settings size={16} /> Configurar cursos
                    </Link>

                    <Link
                        href={`/horarioacademico/tipohorario?idperiodo=${periodo.id}`}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-500 w-full text-left cursor-pointer"
                        onClick={() => setOpen(false)}
                    >
                        <SchoolIcon size={16} /> Configurar Horario
                    </Link>

                </div>
            )}
        </>
    );
}
