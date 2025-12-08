"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


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
      router.push("/Reportes/Menu");

    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };


  return (
    <div className="pagina-center">
  <div className="contenedor-responsive">
    
    <div className="card">
      <h2 className="titulo">S.I.D.E.C</h2>

      <div className="containerInput">
        <label className="label" htmlFor="usuario">Correo Electrónico</label>
        <input
          id="usuario"
          type="text"
          placeholder="Coloca tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="containerInput">
        <label className="label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Coloca tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-primario" onClick={handleSubmit}>
        Iniciar sesión
      </button>

      {/* Separador */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ flex: 1, height: "1px", background: "#ccc" }}></span>
        <p style={{ margin: 0 }}>o</p>
        <span style={{ flex: 1, height: "1px", background: "#ccc" }}></span>
      </div>

      {/* Botón GOOGLE */}
      <button className="btn" style={{ background: "white", border: "1px solid #ccc" }} onClick={handleGoogleLogin}>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          style={{ width: "22px", marginRight: "10px" }}
        />
        Iniciar sesión con Google
      </button>

      <p className="subtitulo">
        ¿No estás registrado? <a href="#">Regístrate con Google</a>
      </p>
    </div>

  </div>
</div>


  );

}
