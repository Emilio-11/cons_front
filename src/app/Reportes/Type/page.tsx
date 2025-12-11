import TypeCard from "@/app/componentes/typeCard";
import "./viewType.css"; // opcional, para asegurar altura 100vh
import AuthGuard from "@/app/componentes/AuthGuard";

export default function ViewType() {
    return (
        <AuthGuard allowedRoles={["Comunidad UNAM", "Externo"]}>
            <div className="view-type-container">
                <TypeCard />
            </div>
        </AuthGuard>

    );
}
