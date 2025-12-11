import AuthGuard from "@/app/componentes/AuthGuard";
import CameraCard from "@/app/componentes/camaraCard";

export default function ViewCamara() {
  return (
    <AuthGuard allowedRoles={['Administrador', "Comunidad UNAM", "Externo"]}>

      <CameraCard />

    </AuthGuard>

  );
}
