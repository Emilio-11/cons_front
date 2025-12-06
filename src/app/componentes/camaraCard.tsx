"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { WebcamProps } from "react-webcam";
import { useRouter } from "next/navigation";


const Webcam = dynamic<WebcamProps>(
  () => import("react-webcam").then((mod) => mod.default),
  { ssr: false }
);

export default function CameraCard() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);

  const [foto, setFoto] = useState<string | null>(null);
  const [capturando, setCapturando] = useState(true);

  const videoConstraints = { facingMode: "environment" };

  const tomarFoto = () => {
    const cam = webcamRef.current;
    if (!cam) return;

    const image = cam.getScreenshot();
    if (image) {
      setFoto(image);
      setCapturando(false);
    }
  };

  const resetearFoto = () => {
    setFoto(null);
    setCapturando(false);

    setTimeout(() => {
      setCapturando(true);
    }, 150);
  };

  const enviarFoto = () => {
    if (!foto) return alert("No hay foto tomada");

    try {
      localStorage.setItem("imagenReporte", foto);
      router.replace("/Reportes/Type");
    } catch (error) {
      console.error("Error guardando la imagen:", error);
    }
  };

  return (
   <div className="pagina-center">
  <div className="contenedor-responsive">
    <div className="card">

      <h2 className="titulo">Tomar evidencia</h2>

      {capturando && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            className="camera-video"
          />

          <button className="btn btn-primario" onClick={tomarFoto}>
            Tomar foto
          </button>
        </>
      )}

      {!capturando && foto && (
        <div className="camera-preview">
          <img src={foto} alt="Foto tomada" className="camera-video" />

          <button className="btn btn-peligro btn-pequeño" onClick={resetearFoto}>
            Volver a tomar
          </button>

          <button className="btn btn-primario" onClick={enviarFoto}>
            Confirmar y enviar
          </button>
        </div>
      )}

    </div>
  </div>
</div>

  );
}
