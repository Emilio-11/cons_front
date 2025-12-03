"use client";

import { useState } from "react";

export default function DescargarQR() {
    const [id, setId] = useState("");

    const descargarQR = () => {
        if (!id) {
            alert("Ingresa un id");
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/consecionarias/download/${id}`;


        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-${id}.png`;
        link.click();
    };

    return (
        <div>
            <input
                type="number"
                placeholder="ID de concesionaria"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />

            <button onClick={descargarQR}>
                Descargar QR
            </button>
        </div>
    );
}
