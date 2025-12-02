"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { WebcamProps } from "react-webcam";
import "./estilos/camara.css";

// Import dinámico correcto para TypeScript
const Webcam = dynamic<WebcamProps>(
  () =>
    import("react-webcam").then((mod) => mod.default), // <-- importante: accedemos a `default`
  { ssr: false }
);

export default function CameraCard() {
  const webcamRef = useRef<Webcam>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [capturando, setCapturando] = useState(true);

  const videoConstraints = { facingMode: "environment" };

  const tomarFoto = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setFoto(imageSrc);
      setCapturando(false);
    }
  };

  const resetearFoto = () => {
    setFoto(null);
    setCapturando(false);
    setTimeout(() => setCapturando(true), 100);
  };

  const enviarFoto = async () => {
    console.log("La foto se enviaría al backend:", foto);
    setFoto(null);
    setCapturando(false);
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

      {foto && (
        <div className="camera-preview">
          <img src={foto} alt="Foto tomada" className="camera-video" />
          <button className="camera-delete" onClick={resetearFoto}>
            Volver a tomar
          </button>
          <button className="camera-btn" onClick={enviarFoto}>
            Enviar evidencia
          </button>
        </div>
      )}
    </div>
  );
}
