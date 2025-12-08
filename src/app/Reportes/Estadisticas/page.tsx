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

    // =======================
    // ESTADOS
    // =======================
    const [tipos, setTipos] = useState<TipoReporte[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [concesionarias, setConcesionarias] = useState<Concesionaria[]>([]);

    const [filtros, setFiltros] = useState<FiltroReporteDto>({
        page: 1,
        limit: 10,
    });

    const [resultados, setResultados] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // =======================
    // CARGAR CATÁLOGOS
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

        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, String(value));
            }
        });

        const res = await fetch(
            `http://localhost:3024/reportes/buscar?${params.toString()}`
        );

        const data = await res.json();
        setResultados(data);
        setLoading(false);
    }

    // =======================
    // HANDLE INPUTS
    // =======================
    function handleChange(key: keyof FiltroReporteDto, value: any) {
        setFiltros(prev => ({ ...prev, [key]: value }));
    }

    // =======================
    // UI
    // =======================
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Filtros de Reportes</h1>

            {/* =======================
          FORMULARIO DE FILTROS
      ======================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Fecha Inicio */}
                <input
                    type="date"
                    className="border p-2 rounded"
                    onChange={e => handleChange('fechaInicio', e.target.value)}
                />

                {/* Fecha Fin */}
                <input
                    type="date"
                    className="border p-2 rounded"
                    onChange={e => handleChange('fechaFin', e.target.value)}
                />

                {/* Concesionaria */}
                <select
                    className="border p-2 rounded"
                    onChange={e => handleChange('concesionaria', Number(e.target.value))}
                >
                    <option value="">Concesionaria</option>
                    {concesionarias.map(c => (
                        <option key={c.id_Concesionaria} value={c.id_Concesionaria}>
                            {c.numAutorizado}
                        </option>
                    ))}
                </select>

                {/* Tipo de reporte */}
                <select
                    className="border p-2 rounded"
                    onChange={e => handleChange('tipoReporte', Number(e.target.value))}
                >
                    <option value="">Tipo de reporte</option>
                    {tipos.map(t => (
                        <option key={t.id_tipoReporte} value={t.id_tipoReporte}>
                            {t.tipoReporte}
                        </option>
                    ))}
                </select>

                {/* Estado */}
                <select
                    className="border p-2 rounded"
                    onChange={e => handleChange('estado', Number(e.target.value))}
                >
                    <option value="">Estado</option>
                    {estados.map(s => (
                        <option key={s.id_Estado} value={s.id_Estado}>
                            {s.estado}
                        </option>
                    ))}
                </select>

                {/* Texto */}
                <input
                    type="text"
                    placeholder="Buscar texto..."
                    className="border p-2 rounded"
                    onChange={e => handleChange('texto', e.target.value)}
                />

                {/* Con Imagen */}
                <select
                    className="border p-2 rounded"
                    onChange={e => handleChange('conImagen', e.target.value === 'true')}
                >
                    <option value="">¿Tiene imagen?</option>
                    <option value="true">Con imagen</option>
                    <option value="false">Sin imagen</option>
                </select>

                {/* Orden fecha */}
                <select
                    className="border p-2 rounded"
                    onChange={e => handleChange('orderFecha', e.target.value as any)}
                >
                    <option value="">Orden fecha</option>
                    <option value="ASC">Más antiguo → reciente</option>
                    <option value="DESC">Más reciente → antiguo</option>
                </select>

                {/* Agrupar */}
                <select
                    className="border p-2 rounded"
                    onChange={e => handleChange('agrupar', e.target.value === 'true')}
                >
                    <option value="false">Agrupar</option>
                    <option value="true">Agrupar por concesionaria</option>
                </select>

                {/* Orden total */}
                <select
                    className="border p-2 rounded"
                    onChange={e => handleChange('orderTotal', e.target.value as any)}
                >
                    <option value="">Orden total</option>
                    <option value="ASC">Total menor → mayor</option>
                    <option value="DESC">Total mayor → menor</option>
                </select>
            </div>

            {/* BOTÓN BUSCAR */}
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={buscar}
            >
                Buscar
            </button>

            {/* LOADING */}
            {loading && <p>Cargando...</p>}

            {/* =======================
          RESULTADOS
      ======================== */}
            {resultados && (
                <div className="mt-6">
                    <pre className="bg-gray-200 p-4 rounded">
                        {JSON.stringify(resultados, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
