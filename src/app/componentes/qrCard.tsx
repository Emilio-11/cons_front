"use client";
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./estilos/qr.css";

export default function QrCard() {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const qrScanner = new Html5Qrcode("qr-reader");

    const config = {
      fps: 10,
      qrbox: 250,
      visualConstranits: { facingMode: "environment" }
    };

    qrScanner.start(
      config.visualConstranits,
      config,
      decodedText => {
        qrScanner.stop().then(() => {
          qrScanner.clear();
          console.log("Escaneo detenido");
        });
        console.log("Leido:", decodedText);
      },
      error => {}
    );

    return () => {
      qrScanner.stop().then(() => qrScanner.clear());
    };
  }, []);

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
