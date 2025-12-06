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

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const concesionariaId = typeof window !== "undefined" ? localStorage.getItem("idConcesionaria") : null;
  const usuarioId = typeof window !== "undefined" ? sessionStorage.getItem("idUser") : null;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        console.log("Token en fetchTipos:", token); // <-- AQUÍ
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reportes/tipos`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        

        const data = await res.json();
        console.log("🔍 DATA RECIBIDA DESDE BACK:", data);
    console.log("🟦 ES ARRAY?:", Array.isArray(data));
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
    if(loading)return; 
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
    setLoading(true);
     console.log("TOKEN QUE ESTOY ENVIANDO:", token); // <-- AQUÍ
  console.log("CONCESIONARIA:", concesionariaId); // ya de paso

    const blob = await fetch(previewImagen).then((res) => res.blob());
    const file = new File([blob], "evidencia.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("tipoReporte", String(seleccionada));
    formData.append("estado", "1");
    formData.append("concesionaria", String(concesionariaId));
    formData.append("descripcion", descripcion);
    formData.append("imagen", file);
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
      setLoading(false);
    }
  };

  return (
    <div className="card-incident">
      <h2 className="title">Reporta un incidente</h2>
      <p className="subtitle">
        Selecciona el tipo de problema y cuéntanos brevemente qué ocurrió.
      </p>


      <div className="select-container">
      <select
        className="select-tipo"
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


      <button className="btn-submit"
       onClick={handleSubmit}
       disabled={loading}>
       {loading ? (
       <>
      <span className="spinner"></span> Enviando reporte...
      </>
        ) : (
      "Enviar reporte"
      )}

      </button>

      {mensajeEnviado && (
        <div className="modal-enviado">
          <p>✅ Reporte enviado correctamente</p>
        </div>
      )}
    </div>
  );
}
