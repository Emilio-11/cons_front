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
    if (!webcamRef.current) return;

    const image = webcamRef.current.getScreenshot();
    if (image) {
      setFoto(image);
      setCapturando(false); // Detener cámara
    }
  };


  const resetearFoto = () => {
    setFoto(null);
    setCapturando(false);

    // Pequeño delay para que react-webcam recargue
    setTimeout(() => setCapturando(true), 100);
  };


  const enviarFoto = () => {
    if (!foto) return alert("No hay foto tomada");


    localStorage.setItem("fotoTemporal", foto);


    router.push("/Reportes/Type");
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

      {/* Vista previa de la foto */}
      {foto && !capturando && (
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
