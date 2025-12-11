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
    agrupar?: string;
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


    const [estadoMasivoSeleccionado, setEstadoMasivoSeleccionado] = useState<number | ''>('');



    useEffect(() => {
        fetch('http://localhost:3024/consecionarias').then(r => r.json()).then(setConcesionarias);
        fetch('http://localhost:3024/reportes/tipos').then(r => r.json()).then(setTipos);
        fetch('http://localhost:3024/reportes/estados').then(r => r.json()).then(setEstados);
    }, []);



    // 1. Actualizar UN solo reporte
    async function actualizarEstadoIndividual(idReporte: number, idEstado: number) {
        if (!idEstado) return;

        const confirm = window.confirm("¿Estás seguro de cambiar el estado de este reporte?");
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:3024/reportes/${idReporte}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idEstado: Number(idEstado) })
            });

            if (res.ok) {
                alert("Estado actualizado correctamente");
                setDetalle(null); // Cerramos detalle
                buscar(); // Refrescamos la lista principal
            } else {
                const err = await res.json();
                alert("Error: " + err.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    }

    // 2. Actualizar VARIOS reportes (Grupo)
    async function actualizarEstadoMasivo() {
        if (!estadoMasivoSeleccionado) {
            alert("Por favor selecciona un estado para aplicar.");
            return;
        }

        if (reportesGrupo.length === 0) return;

        // Extraemos solo los IDs de los reportes cargados en el grupo
        const idsReporte = reportesGrupo.map(r => r.id_Reporte);

        const confirm = window.confirm(`¿Estás seguro de cambiar el estado de ${idsReporte.length} reportes a "${estados.find(e => e.id_Estado == estadoMasivoSeleccionado)?.estado}"?`);
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:3024/reportes/estado/masivo`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idsReporte: idsReporte,
                    idEstado: Number(estadoMasivoSeleccionado)
                })
            });

            if (res.ok) {
                alert("Actualización masiva completada");

                setGrupoAbierto(null); // Cerramos el grupo para forzar al usuario a buscar de nuevo y ver contadores actualizados
                buscar();
            } else {
                const err = await res.json();
                alert("Error: " + err.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error al realizar actualización masiva");
        }
    }



    async function buscar() {
        setLoading(true);
        setResultados([]);
        setDetalle(null);
        setMeta({ total: 0, totalPages: 1, page: 1 });
        setEstadoMasivoSeleccionado(''); // Resetear selección masiva

        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });

        const res = await fetch(`http://localhost:3024/reportes/buscar?${params.toString()}`);
        const data = await res.json();

        setResultados(data.data || []);
        setMeta({ total: data.total, page: data.page, totalPages: data.totalPages });

        setLoading(false);
        setHasSearched(true);
    }


    async function cargarGrupo(dataGrupo: any) {
        const uniqueId = dataGrupo.id_Concesionaria || dataGrupo.id_tipoReporte || dataGrupo.concesionaria || dataGrupo.tipoReporte;

        if (grupoAbierto === String(uniqueId)) {
            setGrupoAbierto(null);
            setReportesGrupo([]);
            return;
        }

        setGrupoAbierto(String(uniqueId));
        setReportesGrupo([]);
        setEstadoMasivoSeleccionado(''); // Resetear select masivo al abrir nuevo grupo

        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && key !== 'agrupar' && key !== 'page' && key !== 'limit') {
                params.append(key, String(value));
            }
        });

        if (filtros.agrupar === 'concesionaria' || filtros.agrupar === 'ambos') {
            if (dataGrupo.r_concesionaria) params.append("concesionaria", dataGrupo.r_concesionaria);
        }
        if (filtros.agrupar === 'tipo' || filtros.agrupar === 'ambos') {
            if (dataGrupo.r_tipoReporte) params.append("tipoReporte", dataGrupo.r_tipoReporte);
        }

        params.append("agrupar", "false");
        params.append("limit", "100");

        try {
            const res = await fetch(`http://localhost:3024/reportes/buscar?${params.toString()}`);
            const data = await res.json();
            setReportesGrupo(data.data || []);
        } catch (error) {
            console.error("Error cargando detalle del grupo", error);
        }
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
                        {concesionarias.map(c => <option key={c.id_Concesionaria} value={c.id_Concesionaria}>{c.numAutorizado}</option>)}
                    </select>
                    <select onChange={e => handleChange('tipoReporte', Number(e.target.value))}>
                        <option value="">Tipo de reporte</option>
                        {tipos.map(t => <option key={t.id_tipoReporte} value={t.id_tipoReporte}>{t.tipoReporte}</option>)}
                    </select>
                    <select onChange={e => handleChange('estado', Number(e.target.value))}>
                        <option value="">Estado</option>
                        {estados.map(s => <option key={s.id_Estado} value={s.id_Estado}>🔵 {s.estado}</option>)}
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
                    <select onChange={e => handleChange('agrupar', e.target.value as any)}>
                        <option value="">Sin Agrupar</option>
                        <option value="concesionaria">Agrupar por concesionaria</option>
                        <option value="tipo">Agrupar por tipo de reporte</option>
                        <option value="ambos">Agrupar por tipo de reporte y concesionaria</option>
                    </select>
                    <select onChange={e => handleChange('orderTotal', e.target.value as any)}>
                        <option value="">Orden total</option>
                        <option value="ASC">Total menor → mayor</option>
                        <option value="DESC">Total mayor → menor</option>
                    </select>
                </div>
                <button className="btn btn-primario" onClick={() => { setFiltros(prev => ({ ...prev, page: 1 })); buscar(); }}>Buscar</button>
            </div>

            {loading && <p>Cargando...</p>}

            {!loading && hasSearched && meta.total > 0 && (
                <p style={{ marginTop: "10px", fontSize: "1.1rem" }}><strong>Total:</strong> {meta.total}</p>
            )}



            <div className="card-Busqueda">
                {resultados.map((r, i) => {
                    if (!r || typeof r !== "object") return null;


                    if (filtros.agrupar) {
                        const uniqueId = r.id_Concesionaria || r.id_tipoReporte || r.concesionaria || r.tipoReporte;
                        const isOpen = grupoAbierto === String(uniqueId);

                        return (
                            <div key={i} style={{ width: "100%", marginBottom: "10px" }}>
                                <div className="card resultado-card" onClick={() => cargarGrupo(r)} style={{ cursor: "pointer", transition: "0.3s", borderLeft: isOpen ? "5px solid #2563eb" : "1px solid #ddd" }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            {r.concesionaria && <h3 style={{ fontSize: "1.1rem" }}> Concesionaria: {r.concesionaria}</h3>}
                                            {r.tipoReporte && <h4 style={{ fontSize: "1rem", color: "#555" }}> Tipo de reporte: {r.tipoReporte}</h4>}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{r.total}</span>
                                            <p style={{ fontSize: '0.8rem', margin: 0 }}>Reportes</p>
                                        </div>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div style={{ marginTop: "5px", marginLeft: "20px", padding: "10px", backgroundColor: "#f9fafb", borderLeft: "2px solid #cbd5e1" }}>


                                        <div style={{ padding: '15px', background: '#e0f2fe', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #bae6fd' }}>
                                            <span style={{ fontWeight: 'bold', color: '#0369a1' }}>🛠 Cambiar de estado:</span>
                                            <select
                                                value={estadoMasivoSeleccionado}
                                                onChange={(e) => setEstadoMasivoSeleccionado(Number(e.target.value))}
                                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            >
                                                <option value="">Seleccionar nuevo estado...</option>
                                                {estados.map(s => (
                                                    <option key={s.id_Estado} value={s.id_Estado}>{s.estado}</option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn"
                                                style={{ backgroundColor: '#0284c7', color: 'white', padding: '5px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                                onClick={actualizarEstadoMasivo}
                                            >
                                                Aplicar a todos ({reportesGrupo.length})
                                            </button>
                                        </div>


                                        {reportesGrupo.length === 0 && <p style={{ padding: "10px", color: "#666" }}>⏳ Cargando reportes...</p>}

                                        {reportesGrupo.map((rep, idx) => (
                                            <div key={idx} className="card" onClick={() => setDetalle(rep)} style={{ marginBottom: "10px", padding: "10px", backgroundColor: "white", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>#{rep.id_Reporte} - {new Date(rep.fecha_reporte).toLocaleDateString()}</span>
                                                    <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "10px", backgroundColor: estadoColor(rep.estado?.estado || rep.estado), color: "white" }}>
                                                        {rep.estado?.estado || rep.estado}
                                                    </span>
                                                </div>

                                                <p style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "5px" }}>

                                                    Descripción: {rep.descripcion?.slice(0, 80)}

                                                </p>

                                                <p style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "2px" }}>

                                                    Tipo de reporte: {rep.tipoReporte.tipoReporte?.slice(0, 80)}

                                                </p>

                                                <p style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "2px" }}>

                                                    Usuario: {rep.usuario.correo_electronico?.slice(0, 80)}

                                                </p>

                                                <p style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "2px" }}>

                                                    Imagen:{" "}

                                                    {rep.imagen && (

                                                        <a

                                                            href={rep.imagen}

                                                            target="_blank"

                                                            rel="noopener noreferrer"

                                                            style={{ color: "#2563eb", textDecoration: "underline" }}

                                                        >

                                                            {rep.imagen.slice(0, 80)}

                                                        </a>

                                                    )}

                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }


                    if (r.id_Reporte == null) return null;

                    return (
                        <div key={i} style={{ width: "100%" }}>
                            <div className="card resultado-card" onClick={() => setDetalle(detalle?.id_Reporte === r.id_Reporte ? null : r)}>
                                <h3 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>Reporte #{r.id_Reporte}</h3>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: estadoColor(typeof r.estado === "object" ? r.estado.estado : r.estado) }} />
                                    <span>{typeof r.estado === "object" ? r.estado.estado : r.estado}</span>
                                </div>
                                <p style={{ opacity: 0.8, marginTop: "5px" }}>{r.descripcion?.slice(0, 120)}...</p>
                            </div>

                            {detalle?.id_Reporte === r.id_Reporte && (
                                <div className="card resultado">
                                    <h2 className="titulo">Detalle del Reporte</h2>


                                    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cambiar Estado:</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <select
                                                defaultValue={detalle.estado?.id_Estado || estados.find(e => e.estado === detalle.estado)?.id_Estado}
                                                onChange={(e) => actualizarEstadoIndividual(detalle.id_Reporte, Number(e.target.value))}
                                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            >
                                                {estados.map(s => (
                                                    <option key={s.id_Estado} value={s.id_Estado}>{s.estado}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <small style={{ color: '#666' }}>Al seleccionar se actualizará automáticamente.</small>
                                    </div>


                                    <div style={{ marginTop: "20px", lineHeight: "1.8", fontSize: "1.1rem" }}>
                                        <p><strong>ID Reporte:</strong> {detalle.id_Reporte}</p>
                                        <p><strong>Descripción:</strong> {detalle.descripcion}</p>
                                        {detalle.imagen && (
                                            <p style={{ wordBreak: "break-all" }}><strong>URL imagen: </strong><a href={detalle.imagen} target="_blank">{detalle.imagen}</a></p>
                                        )}
                                        <p><strong>Fecha:</strong> {new Date(detalle.fecha_reporte).toLocaleString()}</p>
                                        <hr />
                                        <p><strong>Estado Actual:</strong> {detalle.estado?.estado ?? detalle.estado}</p>
                                        <p><strong>Tipo:</strong> {detalle.tipoReporte?.tipoReporte ?? detalle.tipoReporte}</p>
                                        <p><strong>Correo:</strong> {detalle.usuario?.correo_electronico}</p>
                                        <hr />
                                        <p><strong>Número autorizado:</strong> {detalle.concesionaria?.numAutorizado}</p>
                                    </div>

                                    <button className="btn btn-peligro" onClick={() => setDetalle(null)} style={{ marginTop: "20px" }}>Cerrar</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}   