"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./estilos/types.css";

export default function TypeCard() {
  const router = useRouter();

  const [opciones, setOpciones] = useState<any[]>([]);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const concesionariaId = typeof window !== "undefined" ? localStorage.getItem("concesionariaId") : null;


  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reportes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOpciones(data); // [{id_tipoUsuario, tipoUsuario}]
      } catch (err) {
        console.error("Error obteniendo tipos:", err);
      }
    };

    if (token) fetchTipos();
  }, [token]);


  useEffect(() => {
    const img = localStorage.getItem("imagenReporte");
    if (img) setPreviewImagen(img);
  }, []);


  const handleSubmit = async () => {
    if (!seleccionada) {
      alert("Debes seleccionar un tipo de reporte");
      return;
    }

    if (!descripcion.trim()) {
      alert("La descripción no puede estar vacía");
      return;
    }

    if (!previewImagen) {
      alert("No hay imagen para enviar");
      return;
    }


    const blob = await fetch(previewImagen).then((res) => res.blob());
    const file = new File([blob], "evidencia.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("tipoReporte", String(seleccionada));
    formData.append("estado", "1");
    formData.append("concesionaria", String(concesionariaId));
    formData.append("descripcion", descripcion);
    formData.append("imagen", file);

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
        return;
      }

      setMensajeEnviado(true);

      // limpiar
      localStorage.removeItem("imagenReporte");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      alert("Error al enviar reporte");
      console.error(err);
    }
  };

  return (
    <div className="card-incident">
      <h2 className="title">Reporta un incidente</h2>
      <p className="subtitle">
        Selecciona el tipo de problema y cuéntanos brevemente qué ocurrió.
      </p>


      <div className="chips-container">
        {opciones.map((op) => (
          <button
            key={op.id_tipoUsuario}
            className={`chip ${seleccionada === op.id_tipoUsuario ? "chip-selected" : ""}`}
            onClick={() => setSeleccionada(op.id_tipoUsuario)}
          >
            {op.tipoUsuario}
          </button>
        ))}
      </div>


      {previewImagen && (
        <div className="img-preview">
          <img src={previewImagen} alt="preview" />
          <button
            className="btn-retomar"
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


      <button className="btn-submit" onClick={handleSubmit}>
        Enviar reporte
      </button>

      {mensajeEnviado && (
        <div className="modal-enviado">
          <p>✅ Reporte enviado correctamente</p>
        </div>
      )}
    </div>
  );
}
