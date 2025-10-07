const API_URL = "http://localhost:8080";

export async function getDisponibles({ page = 0, size = 12 } = {}) {
    const url = `${API_URL}/productos-publicos?page=${page}&size=${size}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudieron cargar los productos");
    return res.json(); // Page<ProductoDTO>
}

export async function buscarPorTitulo({ titulo, page = 0, size = 12 }) {
    const qs = new URLSearchParams({ titulo, page, size });
    const url = `${API_URL}/productos-publicos/buscar?${qs.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo buscar productos");
    return res.json(); // Page<ProductoDTO>
}

export async function getProducto(id) {
    const url = `${API_URL}/productos-publicos/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Producto no encontrado");
    return res.json();
}
