"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";


export default function OAuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handle = async () => {
            const token = searchParams.get("token");

            if (!token) {
                console.error("No token found in URL");
                return;
            }

            // 1. Guardar token
            sessionStorage.setItem("token", token);

            // 2. Leer payload del JWT
            try {
                const payload: any = jwtDecode(token);

                // 3. Redirigir según tipo de usuario
                if (payload.tipo === "Administrador") {
                    router.replace("/Reportes/Estadisticas");
                } else {
                    router.replace("/Reportes/Menu");
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                router.replace("/");
            }
        };

        handle();
    }, [router, searchParams]);

    return <p>Validando credenciales...</p>;
}
