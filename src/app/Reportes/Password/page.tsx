"use client";

import "@/app/Reportes/Password/password.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ContraseñaPage() {
  const router = useRouter();
  const [Contraseña, setContraseña] = useState("");
  const [ContraseñaN, setContraseñaN] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, []);

  const handleSetPassword = async () => {
    if (!Contraseña || !ContraseñaN) {
      setError("Por favor ingresa la contraseña y confírmala");
      return;
    }
    if (Contraseña !== ContraseñaN) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${apiUrl}/auth/set-password`, {
        email,
        pass: ContraseñaN,
      });

      const token = response.data.access_token;
      sessionStorage.setItem("token", token);
      window.dispatchEvent(new Event("tokenChanged"));

      router.push("/Reportes/QR");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al establecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contenedor-form">
      <h2 className="titulo-form">Creación de Contraseña</h2>
        <p className="subtitulo-form">Esta acción solo se realizará una vez</p>

          <input
            className="textarea"
            placeholder="Ingrese una contraseña"
            value={Contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <input
            className="textarea"
            placeholder="Confirme su contraseña"
            value={ContraseñaN}
            onChange={(e) => setContraseñaN(e.target.value)}
          />
          {error && <p className="error">{error}</p>}

          <button className="btn-submit" onClick={handleSetPassword} disabled={loading}>
            {loading ? "Cargando..." : "Confirmar contraseña"}
          </button>
    </div>

  );
}
