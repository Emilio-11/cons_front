"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MenuReportes() {
  const router = useRouter();

  useEffect(() => {
    // Deshabilitar scroll en html y body
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }

    return () => {
      // Restaurar scroll al salir
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.replace("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      {/* Botones fijos */}
      <button className="btn volver" onClick={handleGoBack} disabled>
        Volver
      </button>

      <button className="btn btn-peligro cerrar" onClick={handleLogout}>
        Cerrar sesión
      </button>

      {/* Contenido */}
      <div className="pagina-center">
        <div className="titulo-contenedor">
          <h2 className="titulo menu-card">Bienvenidos</h2>
          <p className="subtitulo">
            Aquí puedes consultar tus reportes o crear uno nuevo
          </p>
        </div>

        <div className="contenedor-responsive contenedor-menu">
          <div className="cards-wrapper">
            <div
              className="card card-hover"
              onClick={() => router.push("/Reportes/Consultas")}
            >
              <img src="/persona.png" alt="persona" className="card-img" />
              <p className="subtitulo">Consulta</p>
              <div className="card-text">Revisar mis reportes</div>
            </div>

            <div
              className="card card-hover"
              onClick={() => router.push("/Reportes/QR")}
            >
              <img src="/reporte.jpg" alt="reporte" className="card-img" />
              <p className="subtitulo">Genera</p>
              <div className="card-text">Realizar un reporte</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
