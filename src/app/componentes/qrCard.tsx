"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import "./estilos/qr.css";

export default function QrCard() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    const config = {
      fps: 10,
      qrbox: 250,
    };

    scanner
      .start(
        { facingMode: "environment" }, // cámara trasera
        config,
        (decodedText) => {
          console.log("Leído:", decodedText);


          const id = decodedText.split(":")[1];

          if (!id) {
            alert("Código QR inválido");
            return;
          }


          localStorage.setItem("idConcesionaria", id);


          scanner.stop().then(() => {
            scanner.clear();
          });


          router.push("/Reportes/Camara");
        },
        (error) => { }
      )
      .catch((err) => console.error("Error iniciando cámara:", err));

    return () => {
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => { });
    };
  }, [router]);

  return (
    <div className="qr-wrapper">
      <div className="qr-card">
        <h2 className="qr-title">Escanear código QR</h2>

        <div id="qr-reader" className="qr-reader"></div>

        <p className="qr-subtitle">Apunta la cámara al código</p>
      </div>
    </div>
  );
}
