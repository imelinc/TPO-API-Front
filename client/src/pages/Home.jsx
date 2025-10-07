import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroShowcase from "../components/home/HeroShowcase";
import GameCard from "../components/games/gameCard";
import { getDisponibles } from "../api/products";

export default function Home() {
    const navigate = useNavigate();

    // ----- Datos base (traídos una sola vez) -----
    const [raw, setRaw] = useState([]);            // Lista cruda de productos
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // ----- Paginación UI -----
    const [page, setPage] = useState(0);
    const pageSize = 12;

    // ----- Filtros UI -----
    const [q, setQ] = useState("");                // búsqueda por título/desc (cliente)
    const [categoriaId, setCategoriaId] = useState(""); // string para <select>, convertimos a number si no ""
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [soloConStock, setSoloConStock] = useState(true);
    const [soloConDescuento, setSoloConDescuento] = useState(false);
    const [sortBy, setSortBy] = useState("relevancia"); // relevancia|precio|titulo|stock
    const [sortDir, setSortDir] = useState("asc");

    // ====== Fetch inicial (una sola página grande) ======
    useEffect(() => {
        let alive = true;
        setLoading(true);
        setErr("");
        // Traemos “muchos” para poder filtrar/paginar en cliente
        getDisponibles({ page: 0, size: 200 })
            .then((data) => {
                if (!alive) return;
                const items = Array.isArray(data?.content) ? data.content : [];
                setRaw(items);
            })
            .catch((e) => { if (alive) setErr(e.message || "Error cargando productos"); })
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, []);

    // ====== Categorías únicas (para el select) ======
    const categorias = useMemo(() => {
        const set = new Map();
        raw.forEach(p => {
            if (p?.categoriaId != null && p?.categoriaNombre) {
                set.set(p.categoriaId, p.categoriaNombre);
            }
        });
        return Array.from(set.entries()) // [[id, nombre], ...]
            .map(([id, nombre]) => ({ id, nombre }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [raw]);

    // ====== Filtro + orden en cliente ======
    const filtrados = useMemo(() => {
        let list = [...raw];

        // texto en título ó descripción (case-insensitive)
        if (q.trim()) {
            const needle = q.trim().toLowerCase();
            list = list.filter(p => {
                const t = (p.titulo || "").toLowerCase();
                const d = (p.descripcion || "").toLowerCase();
                return t.includes(needle) || d.includes(needle);
            });
        }

        // categoría
        if (categoriaId !== "") {
            const cat = Number(categoriaId);
            list = list.filter(p => p.categoriaId === cat);
        }

        // precio (respetando descuento si existe)
        const parseNum = (v) => (v === "" || v === null || v === undefined) ? undefined : Number(v);
        const min = parseNum(precioMin);
        const max = parseNum(precioMax);

        const precioEfectivo = (p) =>
            p?.tieneDescuento && typeof p?.precioConDescuento === "number"
                ? p.precioConDescuento
                : p.precio;

        if (typeof min === "number" && !Number.isNaN(min)) {
            list = list.filter(p => precioEfectivo(p) >= min);
        }
        if (typeof max === "number" && !Number.isNaN(max)) {
            list = list.filter(p => precioEfectivo(p) <= max);
        }

        // stock / descuento
        if (soloConStock) list = list.filter(p => (p.stock ?? 0) > 0);
        if (soloConDescuento) list = list.filter(p => p.tieneDescuento);

        // orden
        if (sortBy !== "relevancia") {
            const dir = sortDir === "desc" ? -1 : 1;
            list.sort((a, b) => {
                let va, vb;
                switch (sortBy) {
                    case "precio":
                        va = precioEfectivo(a); vb = precioEfectivo(b);
                        break;
                    case "titulo":
                        va = (a.titulo || ""); vb = (b.titulo || "");
                        return va.localeCompare(vb) * dir;
                    case "stock":
                        va = a.stock ?? 0; vb = b.stock ?? 0;
                        break;
                    default:
                        va = 0; vb = 0;
                }
                if (va < vb) return -1 * dir;
                if (va > vb) return 1 * dir;
                return 0;
            });
        }

        return list;
    }, [raw, q, categoriaId, precioMin, precioMax, soloConStock, soloConDescuento, sortBy, sortDir]);

    // Reset de página cuando cambian filtros
    useEffect(() => { setPage(0); },
        [q, categoriaId, precioMin, precioMax, soloConStock, soloConDescuento, sortBy, sortDir]);

    // ====== Paginación en cliente ======
    const total = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = page * pageSize;
    const items = filtrados.slice(start, start + pageSize);

    // ====== UI ======
    return (
        <>
            <HeroShowcase />

            <section id="games-section" className="games-section">
                <div className="games-header">
                    <h2>Juegos destacados</h2>
                    <p>Explorá los títulos más populares y los últimos lanzamientos de PressPlay.</p>
                </div>

                {/* Barra de filtros */}
                <div className="filters-bar" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "10px", marginBottom: "14px" }}>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categorias.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Precio mín."
                        value={precioMin}
                        onChange={(e) => setPrecioMin(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Precio máx."
                        value={precioMax}
                        onChange={(e) => setPrecioMax(e.target.value)}
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input type="checkbox" checked={soloConStock} onChange={e => setSoloConStock(e.target.checked)} />
                        Solo en stock
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input type="checkbox" checked={soloConDescuento} onChange={e => setSoloConDescuento(e.target.checked)} />
                        Con descuento
                    </label>

                    <select value={`${sortBy}|${sortDir}`} onChange={(e) => { const [sb, sd] = e.target.value.split("|"); setSortBy(sb); setSortDir(sd); }}>
                        <option value="relevancia|asc">Orden: Relevancia</option>
                        <option value="precio|asc">Precio ↑</option>
                        <option value="precio|desc">Precio ↓</option>
                        <option value="titulo|asc">Título A–Z</option>
                        <option value="titulo|desc">Título Z–A</option>
                        <option value="stock|desc">Stock ↓</option>
                    </select>

                    <button
                        onClick={() => {
                            setQ(""); setCategoriaId(""); setPrecioMin(""); setPrecioMax("");
                            setSoloConStock(true); setSoloConDescuento(false);
                            setSortBy("relevancia"); setSortDir("asc");
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>

                {/* Contenido */}
                {loading ? (
                    <p>Cargando juegos disponibles…</p>
                ) : err ? (
                    <p style={{ color: "#b91c1c" }}>{err}</p>
                ) : items.length === 0 ? (
                    <p>No hay productos disponibles.</p>
                ) : (
                    <>
                        <div className="games-grid">
                            {items.map((p) => (
                                <GameCard key={p.id} producto={p} onClick={() => navigate(`/producto/${p.id}`)} />
                            ))}
                        </div>

                        <div className="pager">
                            <button disabled={page === 0} onClick={() => setPage((n) => Math.max(0, n - 1))}>
                                ◀ Anterior
                            </button>
                            <span> Página {page + 1} de {totalPages} </span>
                            <button disabled={page + 1 >= totalPages} onClick={() => setPage((n) => n + 1)}>
                                Siguiente ▶
                            </button>
                        </div>
                    </>
                )}
            </section>
        </>
    );
}
