"use client";


import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface TokenPayload {
  sub: number;
  email: string;
  tipo: string; // O 'role', asegúrate de cómo se llama en tu backend
  exp?: number; // Fecha de expiración (opcional pero útil)
}
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

      try {
        const decoded = await jwtDecode<TokenPayload>(token);


        // 4. Lógica de Redirección según el tipo
        if (decoded.tipo == 'Administrador') {
          router.push("/Reportes/Estadisticas"); // Ruta para admins
        } else {
          router.push("/Reportes/Menu");   // Ruta para usuarios normales
        }

      } catch (decodeError) {
        console.error("Error al decodificar el token:", decodeError);
        alert("El token recibido no es válido.");
        setLoading(false);
      }
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
