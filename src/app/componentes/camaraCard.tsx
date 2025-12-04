"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { WebcamProps } from "react-webcam";
import { useRouter } from "next/navigation";
import "./estilos/camara.css";

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
    <div className="camera-card">
      <h2 className="camera-title">Tomar evidencia</h2>

      {capturando && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            className="camera-video"
          />

          <button className="camera-btn" onClick={tomarFoto}>
            Tomar foto
          </button>
        </>
      )}

      {!capturando && foto && (
        <div className="camera-preview">
          <img src={foto} alt="Foto tomada" className="camera-video" />

          <button className="camera-delete" onClick={resetearFoto}>
            Volver a tomar
          </button>

          <button className="camera-btn" onClick={enviarFoto}>
            Confirmar y enviar
          </button>
        </div>
      )}
    </div>
  );
}
