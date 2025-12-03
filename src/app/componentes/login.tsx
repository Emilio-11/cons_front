"use client";

import { useRouter } from "next/navigation";
import "./estilos/login.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./estilos/login.css";

export default function Login() {
  "use client";


  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = jwtDecode<{ tipo: string }>(token);

      // payload.tipo viene del backend
      if (payload.tipo === "Administrador") {
        router.replace("/Admin/Dashboard");
      } else {
        router.replace("/Reportes/QR");
      }
    } catch (error) {
      console.error("Token inválido", error);
      localStorage.removeItem("token");
    }
  }, [router]);



  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          pass: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error en el login");
        return;
      }

      const data = await res.json();

      // Guardar el token
      localStorage.setItem("token", data.token);

      // El redireccionamiento ya lo hace el useEffect, aquí no hace falta
      router.refresh();

    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Coloca tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
