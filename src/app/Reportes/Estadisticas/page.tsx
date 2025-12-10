'use client';

import { useEffect, useState } from 'react';

// =======================
// TYPES
// =======================
interface Concesionaria {
    id_Concesionaria: number;
    numAutorizado: string;
}

interface TipoReporte {
    id_tipoReporte: number;
    tipoReporte: string;
}

interface Estado {
    id_Estado: number;
    estado: string;
}

interface FiltroReporteDto {
    fechaInicio?: string;
    fechaFin?: string;
    estado?: number;
    tipoReporte?: number;
    concesionaria?: number;
    usuario?: number;
    conImagen?: boolean;
    texto?: string;
    page?: number;
    limit?: number;
    orderFecha?: 'ASC' | 'DESC';
    agrupar?: boolean;
    orderTotal?: 'ASC' | 'DESC';
}

export default function ReportesPage() {

    const [tipos, setTipos] = useState<TipoReporte[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [concesionarias, setConcesionarias] = useState<Concesionaria[]>([]);

    const [filtros, setFiltros] = useState<FiltroReporteDto>({
        page: 1,
        limit: 5
    });

    const [resultados, setResultados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [detalle, setDetalle] = useState<any | null>(null);

    const [meta, setMeta] = useState({
        total: 0,
        totalPages: 1,
        page: 1
    });

    const [hasSearched, setHasSearched] = useState(false);
    const [grupoAbierto, setGrupoAbierto] = useState<string | null>(null);
    const [reportesGrupo, setReportesGrupo] = useState<any[]>([]);


    // =======================
    // CATÁLOGOS
    // =======================
    useEffect(() => {
        fetch('http://localhost:3024/consecionarias')
            .then(r => r.json())
            .then(setConcesionarias);

        fetch('http://localhost:3024/reportes/tipos')
            .then(r => r.json())
            .then(setTipos);

        fetch('http://localhost:3024/reportes/estados')
            .then(r => r.json())
            .then(setEstados);
    }, []);

    // =======================
    // BUSCAR REPORTES
    // =======================
    async function buscar() {
        setLoading(true);

        // EVITA ERRORES AL CAMBIAR AGRUPAR
        setResultados([]);
        setDetalle(null);
        setMeta({ total: 0, totalPages: 1, page: 1 });

        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });

        const res = await fetch(
            `http://localhost:3024/reportes/buscar?${params.toString()}`
        );

        const data = await res.json();

        setResultados(data.data || []);

        setMeta({
            total: data.total,
            page: data.page,
            totalPages: data.totalPages
        });

        setDetalle(null);
        setLoading(false);
        setHasSearched(true);
    }
    // ==============================
        // FUNCIÓN CARGAR GRUPO 
        // ==============================
        async function cargarGrupo(concesionaria: string) {
            // Si está abierto, se cierra
            if (grupoAbierto === concesionaria) {
                setGrupoAbierto(null);
                setReportesGrupo([]);
                return;
            }

            setGrupoAbierto(concesionaria);
            setReportesGrupo([]);

            const params = new URLSearchParams();
            params.append("concesionaria", concesionaria);

            // Evitar agrupación
            params.append("agrupar", "false");
            params.append("limit", "9999"); // Para traer todos los reportes

            const res = await fetch(
                `http://localhost:3024/reportes/buscar?${params.toString()}`
            );

            const data = await res.json();

            setReportesGrupo(data.data || []);
        }

    function handleChange(key: keyof FiltroReporteDto, value: any) {
        setFiltros(prev => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        if (hasSearched) buscar();
    }, [filtros.page]);

    const estadoColor = (estado: string) => {
        if (estado === 'Pendiente') return '#9ca3af';
        if (estado === 'En Proceso') return '#fbbf24';
        if (estado === 'Resuelto') return '#22c55e';
        return '#a3a3a3';
    };

    return (
        <div className="filtro">

            <div className="contenedor-responsive card" style={{ maxWidth: "800px", marginTop: "0.5cm", alignItems: "center" }}>
                <h1 className="titulo">Filtros de Reportes</h1>

                <div className="groupInput">

                    <input type="date" onChange={e => handleChange('fechaInicio', e.target.value)} />
                    <input type="date" onChange={e => handleChange('fechaFin', e.target.value)} />

                    <select onChange={e => handleChange('concesionaria', Number(e.target.value))}>
                        <option value="">Concesionaria</option>
                        {concesionarias.map(c => (
                            <option key={c.id_Concesionaria} value={c.id_Concesionaria}>
                                {c.numAutorizado}
                            </option>
                        ))}
                    </select>

                    <select onChange={e => handleChange('tipoReporte', Number(e.target.value))}>
                        <option value="">Tipo de reporte</option>
                        {tipos.map(t => (
                            <option key={t.id_tipoReporte} value={t.id_tipoReporte}>
                                {t.tipoReporte}
                            </option>
                        ))}
                    </select>

                    <select onChange={e => handleChange('estado', Number(e.target.value))}>
                        <option value="">Estado</option>
                        {estados.map(s => (
                            <option key={s.id_Estado} value={s.id_Estado} style={{ color: estadoColor(s.estado), fontWeight: "600" }}>
                                🔵 {s.estado}
                            </option>
                        ))}
                    </select>

                    <input type="text" placeholder="Buscar texto..." onChange={e => handleChange('texto', e.target.value)} />

                    <select onChange={e => handleChange('conImagen', e.target.value === 'true')}>
                        <option value="">¿Tiene imagen?</option>
                        <option value="true">Con imagen</option>
                        <option value="false">Sin imagen</option>
                    </select>

                    <select onChange={e => handleChange('orderFecha', e.target.value as any)}>
                        <option value="">Orden fecha</option>
                        <option value="ASC">Más antiguo → reciente</option>
                        <option value="DESC">Más reciente → antiguo</option>
                    </select>

                    <select onChange={e => handleChange('agrupar', e.target.value === 'true')}>
                        <option value="false">Agrupar</option>
                        <option value="true">Agrupar por concesionaria</option>
                    </select>

                    <select onChange={e => handleChange('orderTotal', e.target.value as any)}>
                        <option value="">Orden total</option>
                        <option value="ASC">Total menor → mayor</option>
                        <option value="DESC">Total mayor → menor</option>
                    </select>

                </div>

                <button
                    className="btn btn-primario"
                    onClick={() => {
                        setFiltros(prev => ({ ...prev, page: 1 }));
                        buscar();
                    }}
                >
                    Buscar
                </button>
            </div>

            {loading && <p>Cargando...</p>}

            {!loading && hasSearched && meta.total > 0 && (
                <p style={{ marginTop: "10px", fontSize: "1.1rem" }}>
                    <strong>Total de reportes encontrados:</strong> {meta.total}
                </p>
            )}

            {hasSearched && meta.total > 0 && (
                <div style={{
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    justifyContent: "center"
                }}>

                    <button
                        className="btn btn-secundario"
                        disabled={meta.page <= 1}
                        onClick={() => {
                            setFiltros(prev => ({ ...prev, page: prev.page! - 1 }));
                        }}
                    >
                        ⬅️ Anterior
                    </button>

                    <span style={{ fontWeight: "bold" }}>
                        Página {meta.page} de {meta.totalPages}
                    </span>

                    <button
                        className="btn btn-secundario"
                        disabled={meta.page >= meta.totalPages}
                        onClick={() => {
                            setFiltros(prev => ({ ...prev, page: prev.page! + 1 }));
                        }}
                    >
                        Siguiente ➡️
                    </button>
                </div>
            )}

            {/* ============================== */}
            {/*       RESULTADOS       */}
            {/* ============================== */}
            <div className="card-Busqueda">

                {resultados.map((r, i) => {

                    
                    if (!r || typeof r !== "object") return null;

                
                    
                    // ==============================
                    // VISTA AGRUPADA
                    // ==============================
                    if (filtros.agrupar) {
                return (
                <div key={i} style={{ width: "100%" }}>
                    <div
                        className="card resultado-card"
                        onClick={() => cargarGrupo(r.concesionaria)}
                        style={{ cursor: "pointer", transition: "0.3s" }}
                    >
                        <h3 style={{ fontSize: "1.2rem" }}>
                            Concesionaria: {r.concesionaria}
                        </h3>

                        <p><strong>Tipo de reporte:</strong> {r.tipoReporte}</p>
                        <p><strong>Total:</strong> {r.total}</p>
                    </div>

                            {/* Mostrar reportes del grupo */}
                            {grupoAbierto === r.concesionaria && (
                                <div
                                    style={{
                                        marginTop: "10px",
                                        animation: "fadeIn 0.3s",
                                        paddingLeft: "20px"
                                    }}
                                >

                                    {/* Cargando */}
                                    {reportesGrupo.length === 0 && (
                                        <p style={{ opacity: 0.7 }}>Cargando reportes...</p>
                                    )}

                                    {/* Reportes individuales */}
                                    {reportesGrupo.length > 0 &&
                                        reportesGrupo.map((rep, idx) => (
                                            <div
                                                key={idx}
                                                className="card resultado-card"
                                                style={{
                                                    marginTop: "10px",
                                                    borderLeft: "4px solid #2563eb"
                                                }}
                                            >
                                                <h3 style={{ fontSize: "1.1rem" }}>
                                                    Reporte #{rep.id_Reporte}
                                                </h3>

                                                <p style={{ opacity: 0.8 }}>
                                                    {rep.descripcion?.slice(0, 120)}...
                                                </p>

                                                <p>
                                                    <strong>Estado:</strong>{" "}
                                                    {rep.estado?.estado ?? rep.estado}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    );
                }


                    // ==============================
                    //   ⬇⬇⬇ NORMAL ⬇⬇⬇
                    // ==============================
                    if (r.id_Reporte == null) return null;

                    return (
                        <div key={i} style={{ width: "100%" }}>

                            <div
                                className="card resultado-card"
                                onClick={() =>
                                    setDetalle(detalle?.id_Reporte === r.id_Reporte ? null : r)
                                }
                            >
                                <h3 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>
                                    Reporte #{r.id_Reporte}
                                </h3>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            borderRadius: "50%",
                                            backgroundColor: estadoColor(
                                                typeof r.estado === "object" ? r.estado.estado : r.estado
                                            )
                                        }}
                                    />
                                    <span>
                                        {typeof r.estado === "object" ? r.estado.estado : r.estado}
                                    </span>
                                </div>

                                <p style={{ opacity: 0.8, marginTop: "5px" }}>
                                    {r.descripcion?.slice(0, 120)}...
                                </p>
                            </div>

                            {detalle?.id_Reporte === r.id_Reporte && (
                                <div className="card resultado">

                                    <h2 className="titulo">Detalle del Reporte</h2>

                                    <div style={{ marginTop: "20px", lineHeight: "1.8", fontSize: "1.1rem" }}>
                                        <p><strong>ID Reporte:</strong> {detalle.id_Reporte}</p>
                                        <p><strong>Descripción:</strong> {detalle.descripcion}</p>

                                        {detalle.imagen ? (
                                            <p style={{ wordBreak: "break-all" }}>
                                                <strong>URL imagen: </strong>
                                                {detalle.imagen.replace("&export=download", "")}
                                            </p>
                                        ) : (
                                            <p>No hay imagen</p>
                                        )}

                                        <p><strong>Fecha:</strong> {new Date(detalle.fecha_reporte).toLocaleString()}</p>

                                        <hr />

                                        <h3>Estado</h3>
                                        <p><strong>Estado:</strong> {detalle.estado?.estado ?? detalle.estado}</p>

                                        <hr />

                                        <h3>Tipo de reporte</h3>
                                        <p><strong>Tipo:</strong> {detalle.tipoReporte?.tipoReporte ?? detalle.tipoReporte}</p>

                                        <hr />

                                        <h3>Usuario</h3>
                                        <p><strong>ID Usuario:</strong> {detalle.usuario?.id_usuario}</p>
                                        <p><strong>Correo:</strong> {detalle.usuario?.correo_electronico}</p>

                                        <hr />

                                        <h3>Concesionaria</h3>
                                        <p><strong>Número autorizado:</strong> {detalle.concesionaria?.numAutorizado}</p>
                                        <p><strong>Dependencia:</strong> {detalle.concesionaria?.dependencia}</p>
                                        <p><strong>Localidad:</strong> {detalle.concesionaria?.localidad}</p>
                                        <p><strong>Autorizado:</strong> {detalle.concesionaria?.autorizado}</p>
                                        <p><strong>Horario:</strong> {detalle.concesionaria?.horario_atencion}</p>
                                    </div>

                                    <button
                                        className="btn btn-peligro"
                                        onClick={() => setDetalle(null)}
                                        style={{ marginTop: "20px" }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

        </div>
    );
}
