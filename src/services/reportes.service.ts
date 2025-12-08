const API_URL = 'http://localhost:3024';

export async function getConcesionarias() {
    const res = await fetch(`${API_URL}/consecionarias`);
    return res.json();
}

export async function getTipos(token: string) {
    const res = await fetch(`${API_URL}/reportes/tipos`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export async function getEstados(token: string) {
    const res = await fetch(`${API_URL}/reportes/estados`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export async function buscarReportes(
    filtros: Record<string, any>,
    token: string
) {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
            params.append(key, String(value));
        }
    });

    const res = await fetch(
        `${API_URL}/reportes/buscar?${params.toString()}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return res.json();
}
