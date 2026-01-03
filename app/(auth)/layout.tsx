// //src/(auth)/layout.tsx
// src/(auth)/layout.tsx
import React from 'react';
import './auth.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    );
    // return (
    //     <div data-auth className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-bg"
    //         // style={{
    //         //     backgroundImage:
    //         //         "url('https://www.sunedu.gob.pe/wp-content/uploads/2019/02/Post-licenciamiento-UNAP-enlace.jpg')",
    //         // }}
    //     >
    //         {/* Capa oscura */}
    //         {/*<div className="absolute inset-0 bg-black/60"></div>*/}
    //
    //         {/* Contenido */}
    //         <main className="relative z-10 w-full flex justify-center items-center">
    //             {children}
    //         </main>
    //     </div>
    // );
}

// import React from 'react'
// import './auth.css';
//
// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <div data-auth className="min-h-screen bg-app-2 text-app">
//             <main className="auth-shell">{children}</main>
//         </div>
//     )
// }