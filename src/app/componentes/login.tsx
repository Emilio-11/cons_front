"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./estilos/login.css";

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = sessionStorage.getItem("token");
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
      sessionStorage.removeItem("token");
    }
  }, [router]);



  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
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
         setLoading(false);
        return;
      }

      const data = await res.json();

      // Guardar el token
      sessionStorage.setItem("token", data.access_token);
      //Guardo el id de Usuario
      sessionStorage.setItem("idUser",data.idUser);
      // El redireccionamiento ya lo hace el useEffect, aquí no hace falta
      router.push("/Reportes/QR");

    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };


  return (
    <div className="contenedor-login">
      <div className="caja-login">

        <h2 className="titulo-login">S.I.D.E.C</h2>

        <label className="Usuario" htmlFor="usuario">Correo Electrónico</label>
        <input
         className="cuadro1"
          type="text"
          id="usuario"
          placeholder="Coloca tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="Password" htmlFor="password">Contraseña</label>
        <input
          className="cuadro2"
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
