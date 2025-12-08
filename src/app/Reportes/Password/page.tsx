"use client";


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

      router.push("/Reportes/Menu");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al establecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagina-center">
  <div className="contenedor-responsive">
    <div className="card">

      <h2 className="titulo">Creación de Contraseña</h2>
      <p className="subtitulo">Esta acción solo se realizará una vez</p>

      <input
        placeholder="Ingrese una contraseña"
        value={Contraseña}
        onChange={(e) => setContraseña(e.target.value)}
      />

      <input
        placeholder="Confirme su contraseña"
        value={ContraseñaN}
        onChange={(e) => setContraseñaN(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button
        className="btn btn-primario"
        onClick={handleSetPassword}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Confirmar contraseña"}
      </button>

    </div>
  </div>
</div>

  );
}
