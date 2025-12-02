"use client";

import { useRouter } from "next/navigation";
import "./estilos/login.css";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");


  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:3024/auth/google`;
  };

  return (
  <div className="contenedor-login">
    <div className="caja-login">

      <h2 className="titulo-login">Reportes Concesionaria FES</h2>

      <label htmlFor="usuario">Usuario</label>
      <input
        type="text"
        id="usuario"
        placeholder="Coloca tu correo electrónico"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        id="password"
        placeholder="Coloca tu contraseña"
      />

      {/* Botón normal de login */}
      <button className="btn-submit" onClick={handleSubmit}>
        Iniciar sesión
      </button>

      {/* ADIVISIÓN */}
      <div className="division">
        <span></span>
        <p>o</p>
        <span></span>
      </div>

      {/* BOTÓN DE GOOGLE */}
      <button className="google-btn" onClick={handleGoogleLogin}>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
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
