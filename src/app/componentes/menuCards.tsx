"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MenuReportes() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // redirige si no existe token
    }
  }, []);

  return (
    <div className="pagina-center">
      <div className="titulo-contenedor">
        <h2 className="titulo menu-card">Bienvenidos</h2>
        <p className="subtitulo">Aquí puedes consultar tus reportes o crear uno nuevo</p>
      </div>

      <div className="contenedor-responsive contenedor-menu">
        <div className="cards-wrapper">

          <div
            className="card card-hover"
            onClick={() => router.push("/Reportes/Consulta")}
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
  );
}
