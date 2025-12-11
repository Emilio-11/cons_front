"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TypeCard() {
  const router = useRouter();

  const [opciones, setOpciones] = useState<any[]>([]);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const concesionariaId =
    typeof window !== "undefined" ? localStorage.getItem("idConcesionaria") : null;
  const usuarioId =
    typeof window !== "undefined" ? sessionStorage.getItem("idUser") : null;

  const formData = new FormData();

  // Obtener tipos
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reportes/tipos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setOpciones(data);
      } catch (err) {
        console.error("Error obteniendo tipos:", err);
      }
    };

    if (token) fetchTipos();
  }, [token]);

  // Cargar imagen previa
  useEffect(() => {
    const img = localStorage.getItem("imagenReporte");
    if (img) setPreviewImagen(img);
  }, []);

  // Enviar reporte
  const handleSubmit = async () => {
    if (loading) return;

    if (!seleccionada) {
      alert("Debes seleccionar un tipo de reporte");
      return;
    }

    if (!descripcion.trim()) {
      alert("La descripción no puede estar vacía");
      return;
    }

    // Si hay foto
    if (previewImagen) {
      const blob = await fetch(previewImagen).then((res) => res.blob());
      const file = new File([blob], "evidencia.jpg", { type: "image/jpeg" });
      formData.append("imagen", file);
    }

    setLoading(true);

    formData.append("tipoReporte", String(seleccionada));
    formData.append("estado", "1");
    formData.append("concesionaria", String(concesionariaId));
    formData.append("descripcion", descripcion);
    formData.append("fecha", new Date().toISOString());
    formData.append("usuarioId", String(usuarioId));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reportes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Error al enviar el reporte");
        setLoading(false);
        return;
      }

      // Mostrar mensaje visible arriba
      setMensajeEnviado(true);

      // Limpiar foto
      localStorage.removeItem("imagenReporte");

      setTimeout(() => {
        router.push("/Reportes/Menu");
      }, 1500);
    } catch (err) {
      alert("Error al enviar el reporte");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="pagina-center">
      {mensajeEnviado && (
        <div className="modal-enviado arriba">
          <p> Reporte enviado correctamente</p>
        </div>
      )}

      <div className="contenedor-responsive contenedor-reportes">
        <div className="card">
          <h2 className="titulo">Reporta un incidente</h2>
          <p className="subtitulo">
            Selecciona el tipo de problema y cuéntanos brevemente qué ocurrió.
          </p>

          {/* Selector */}
          <div className="select-container">
            <select
              className="chip"
              value={seleccionada ?? ""}
              onChange={(e) => setSeleccionada(Number(e.target.value))}
            >
              <option value="" disabled>
                Selecciona un tipo de reporte
              </option>
              {opciones.map((op) => (
                <option key={op.id_tipoReporte} value={op.id_tipoReporte}>
                  {op.tipoReporte}
                </option>
              ))}
            </select>
          </div>

          {/* Cuando NO hay foto */}
          {!previewImagen && (
            <button
              className="btn btn-primario"
              onClick={() => router.push("/Reportes/Camara")}
            >
              Tomar foto
            </button>
          )}

          {/* Cuando SÍ hay foto */}
          {previewImagen && (
            <div className="img-preview">
              <img src={previewImagen} alt="preview" />
              <button
                className="btn btn-primario btn-pequeño"
                onClick={() => router.push("/Reportes/Camara")}
              >
                Retomar foto
              </button>
            </div>
          )}

          <textarea
            className="textarea"
            placeholder="Ejemplo: Encontré comida en mal estado..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>

          <button
            className="btn btn-primario"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Enviando reporte...
              </>
            ) : (
              "Enviar reporte"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
