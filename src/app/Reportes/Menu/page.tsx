import AuthGuard from "@/app/componentes/AuthGuard";
import MenuReportes from "@/app/componentes/menuCards";
import DescargarQR from "@/app/descargar_qr/page";


export default function ViewMenu() {
    return (
        <AuthGuard allowedRoles={["Comunidad UNAM", "Externo"]}>
            <MenuReportes></MenuReportes>
        </AuthGuard>

    )


}