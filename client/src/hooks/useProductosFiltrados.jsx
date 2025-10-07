import { useEffect, useMemo, useState } from "react";
import { getPublicos, getPorCategoria, buscarPorTitulo, buscarPorPrecio } from "../api/products";

export function useProductosFiltrados({ q, categoriaId, precioMin, precioMax, soloConDescuento, soloConStock, sortBy, sortDir, page, size }) {
    const [raw, setRaw] = useState([]);      // lista cruda del endpoint base
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let alive = true;
        setLoading(true); setErr("");
        const baseSize = 120; // traer muchos para poder filtrar/paginar client-side

        const fetchBase = async () => {
            // elegimos la fuente más selectiva disponible
            if (q && q.trim().length >= 2) {
                return buscarPorTitulo({ q, page: 0, size: baseSize });
            }
            if (categoriaId) {
                return getPorCategoria({ categoriaId, page: 0, size: baseSize });
            }
            if (typeof precioMin === "number" || typeof precioMax === "number") {
                return buscarPorPrecio({ min: precioMin ?? 0, max: precioMax ?? 999999999, page: 0, size: baseSize });
            }
            // listado publico
            return getPublicos({ page: 0, size: baseSize });
        };

        fetchBase()
            .then((pageData) => {
                if (!alive) return;
                setRaw(pageData?.content ?? []);
            })
            .catch((e) => alive && setErr(e.message || "No se pudieron obtener productos"))
            .finally(() => alive && setLoading(false));

        return () => { alive = false; };
    }, [q, categoriaId, precioMin, precioMax]);

    // filtros en cliente
    const filtrados = useMemo(() => {
        let list = [...raw];

        if (typeof precioMin === "number") list = list.filter(p => (p.tieneDescuento ? p.precioConDescuento : p.precio) >= precioMin);
        if (typeof precioMax === "number") list = list.filter(p => (p.tieneDescuento ? p.precioConDescuento : p.precio) <= precioMax);

        if (soloConStock) list = list.filter(p => (p.stock ?? 0) > 0);
        if (soloConDescuento) list = list.filter(p => p.tieneDescuento);

        // sort
        if (sortBy) {
            const dir = (sortDir === "desc" ? -1 : 1);
            list.sort((a, b) => {
                const va = sortBy === "precio" ? (a.tieneDescuento ? a.precioConDescuento : a.precio) :
                    sortBy === "titulo" ? (a.titulo || "") :
                        sortBy === "stock" ? (a.stock ?? 0) : 0;
                const vb = sortBy === "precio" ? (b.tieneDescuento ? b.precioConDescuento : b.precio) :
                    sortBy === "titulo" ? (b.titulo || "") :
                        sortBy === "stock" ? (b.stock ?? 0) : 0;
                if (va < vb) return -1 * dir;
                if (va > vb) return 1 * dir;
                return 0;
            });
        }

        return list;
    }, [raw, precioMin, precioMax, soloConStock, soloConDescuento, sortBy, sortDir]);

    // paginación en cliente
    const total = filtrados.length;
    const start = page * size;
    const pageItems = filtrados.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(total / size));

    return { items: pageItems, total, totalPages, loading, err };
}
