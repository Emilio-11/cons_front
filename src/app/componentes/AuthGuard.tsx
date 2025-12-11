'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // Roles permitidos para ver esta página
}

interface TokenPayload {
    tipo: string; // Asegúrate que coincida con tu backend
    exp: number;
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // 1. Obtener token
        const token = sessionStorage.getItem('token');

        if (!token) {
            // Si no hay token, mandar al login
            router.push('/');
            return;
        }

        try {
            // 2. Decodificar token
            const decoded = jwtDecode<TokenPayload>(token);
            const currentTime = Date.now() / 1000;

            // 3. Verificar expiración
            if (decoded.exp < currentTime) {
                alert("Tu sesión ha expirado.");
                sessionStorage.clear();
                router.push('/');
                return;
            }

            // 4. Verificar Roles (si se especificaron)
            if (allowedRoles && !allowedRoles.includes(decoded.tipo)) {
                // Si el usuario existe pero no tiene el rol correcto (ej: Usuario queriendo entrar a Admin)
                alert("No tienes permisos para acceder a esta página.");
                router.push('/'); // O una página de "Acceso Denegado"
                return;
            }

            // Si pasa todo, autorizamos
            setAuthorized(true);

        } catch (error) {
            console.error("Token inválido", error);
            sessionStorage.clear();
            router.push('/');
        }
    }, [router, allowedRoles]);

    // Mientras verificamos, mostramos nada o un spinner para evitar "parpadeos" de contenido protegido
    if (!authorized) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <p>Verificando permisos...</p>
            </div>
        );
    }

    // Si está autorizado, renderizamos la página hija
    return <>{children}</>;
}