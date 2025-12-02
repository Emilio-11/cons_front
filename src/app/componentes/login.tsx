"use client";

import { useRouter } from "next/navigation";
import "./estilos/login.css";

export default function Login() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:3024/auth/google`;
  };

  return (
    <div className="contenedor-login">
      <div className="caja-login">
        <h2 className="titulo-login">Reportes Conscesionaria FES</h2>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
          />
          Iniciar sesión con Google
        </button>

        <p className="registro-text">
          ¿No estás registrado? <a href="#">Regístrate con Google</a>
        </p>
      </div>
    </div>
  );
}
