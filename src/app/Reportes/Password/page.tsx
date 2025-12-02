"use client";

import "@/app/Reportes/Password/password.css";
import axios from "axios";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ContraseñaPage() {

  const [Contraseña, setContraseña] = useState<string>("");
  const [ContraseñaN, setContraseñaN] = useState<string>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/set-password`, {
        email,
        pass:ContraseñaN,
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("tokenChanged"));

      // Redirigir al Home
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Error al establecer la contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contenedor-form">
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

      <button className="btn-submit" onClick={handleSetPassword}>
        Confirmar contraseña
      </button>
    </div>
  );

    function setError(arg0: any) {
        throw new Error("Function not implemented.", arg0);
    }

}
