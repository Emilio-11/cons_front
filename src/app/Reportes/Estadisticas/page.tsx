import ReportesPage from "@/app/componentes/admin";
import AuthGuard from "@/app/componentes/AuthGuard";

export default function AdminView() {
    return (
        <AuthGuard allowedRoles={['Administrador']}>
            <ReportesPage />
        </AuthGuard>

    );
}