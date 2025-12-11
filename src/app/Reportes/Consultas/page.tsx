import AuthGuard from "@/app/componentes/AuthGuard";
import UserReportesPage from "@/app/componentes/consulta";


export default function ConsultaPage() {
    return (
        <AuthGuard allowedRoles={["Comunidad UNAM", "Externo"]}>

            <UserReportesPage />
        </AuthGuard>

    );
}