import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

interface Estado {
    id_Estado: number;
    estado: string;
}

export default function UserReportesPage() {

    const [reportes, setReportes] = useState<any[]>([]);
    const [detalle, setDetalle] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const limit = 5;

    const [meta, setMeta] = useState({
        total: 0,
        totalPages: 1
    });

    const [estadoFiltro, setEstadoFiltro] = useState(0);

    const estadoColor = (estado: string) => {
        if (estado === 'Pendiente') return '#9ca3af';
        if (estado === 'En Proceso') return '#fbbf24';
        if (estado === 'Resuelto') return '#22c55e';
        return '#a3a3a3';
    };

    async function cargarReportes() {
        setLoading(true);

        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No se encontró token");
            setLoading(false);
            return;
        }

        const res = await fetch(
            `http://localhost:3024/reportes/mis-reportes?idEstado=${estadoFiltro}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
            setReportes(data);
            setMeta({
                total: data.length,
                totalPages: Math.ceil(data.length / limit)
            });
        } else {
            setReportes(data.data || []);
            setMeta({
                total: data.total || 0,
                totalPages: data.totalPages || 1
            });
        }

        setLoading(false);
    }

    useEffect(() => {
        cargarReportes();
    }, [page, estadoFiltro]);

    // 👉 PAGINACIÓN REAL
    const reportesPaginados = reportes.slice((page - 1) * limit, page * limit);

    return (
        <div className="filtro">

            <div className="contenedor-responsive card" style={{ maxWidth: "700px", marginTop: "1rem" }}>
                <h1 className="titulo">Mis Reportes</h1>
                <p style={{ opacity: 0.8 }}>Aquí puedes ver el estado actual de tus reportes.</p>

                {/* 👉 NUMERO TOTAL DE REPORTES */}
                <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Total de reportes: {meta.total}
                </p>

                <div style={{ marginTop: "20px" }}>
                    <label style={{ fontWeight: "bold" }}>Filtrar por estado:</label>
                    <select
                        className="input-Estados"
                        value={estadoFiltro}
                        onChange={(e) => {
                            setEstadoFiltro(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        <option value={0} style={{ color: "#3B82F6" }}>🔵 Todos</option>

                        <option
                            value={1}
                            style={{ color: estadoColor("Pendiente") }}
                        >
                            🔵 Pendientes
                        </option>

                        <option
                            value={2}
                            style={{ color: estadoColor("En Proceso") }}
                        >
                            🔵 En Proceso
                        </option>

                        <option
                            value={3}
                            style={{ color: estadoColor("Resuelto") }}
                        >
                            🔵 Resueltos
                        </option>
                    </select>

                </div>
            </div>

            {loading && <p>Cargando...</p>}

            {/* 👉 PAGINACIÓN */}
            {!loading && meta.total > 0 && (
                <div className="paginacion">
                    <button
                        className="btn-paginacion"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Anterior
                    </button>

                    <span className="paginacion-info">
                        Página {page} de {meta.totalPages}
                    </span>

                    <button
                        className="btn-paginacion"
                        disabled={page >= meta.totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* LISTA DE REPORTES */}
            <div className="card-Busqueda" style={{ marginTop: "15px" }}>

                {reportesPaginados.map((r, i) => (
                    <div key={i} style={{ width: "100%" }}>

                        <div
                            className="card resultado-card"
                            onClick={() =>
                                setDetalle(detalle?.id_Reporte === r.id_Reporte ? null : r)
                            }
                            style={{ transition: "0.3s", cursor: "pointer" }}
                        >

                            <h3 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>
                                Fecha: {new Date(r.fecha_reporte).toLocaleString()}
                            </h3>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        backgroundColor: estadoColor(r.estado.estado)
                                    }}
                                />
                                <span>{r.estado.estado}</span>
                            </div>

                            <p style={{ opacity: 0.8, marginTop: "5px" }}>
                                {r.descripcion?.slice(0, 120)}...
                            </p>
                        </div>

                        {detalle?.id_Reporte === r.id_Reporte && (
                            <div
                                className="card resultado"
                                style={{ animation: "fadeIn 0.25s ease-in-out" }}
                            >
                                <h2 className="titulo">Detalle del Reporte</h2>

                                <div style={{ marginTop: "20px" }}>
                                    <p><strong>Descripción:</strong> {detalle.descripcion}</p>

                                    {detalle.imagen ? (
                                        <p style={{ wordBreak: "break-all" }}>
                                            <strong>URL imagen: </strong>
                                            <a
                                                href={detalle.imagen.replace("&export=download", "")}
                                                target="_blank"
                                                style={{ color: "blue", textDecoration: "underline" }}
                                            >
                                                {detalle.imagen.replace("&export=download", "")}
                                            </a>
                                        </p>
                                    ) : (
                                        <p>No hay imagen</p>
                                    )}

                                    <button
                                        className="btn btn-peligro"
                                        onClick={() => setDetalle(null)}
                                        style={{ marginTop: "20px" }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                ))}

                {reportes.length === 0 && !loading && (
                    <p style={{ textAlign: "center", opacity: 0.7 }}>
                        No se encontraron reportes para este estado.
                    </p>
                )}

            </div>
        </div>
    );
}
