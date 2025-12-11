import AuthGuard from "@/app/componentes/AuthGuard";
import QrCard from "@/app/componentes/qrCard";


export default function ViewQR() {
    return (
        <AuthGuard allowedRoles={["Comunidad UNAM", "Externo"]}>
            <QrCard></QrCard>
        </AuthGuard>

    )
}