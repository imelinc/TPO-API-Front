import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buscarPorTitulo } from "../api/products";
import GameCard from "../components/games/gameCard";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Search() {
    const q = useQuery().get("q") || "";
    const [pageData, setPageData] = useState(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const size = 12;

    useEffect(() => setPage(0), [q]);

    useEffect(() => {
        if (!q) return;
        let alive = true;
        setLoading(true);
        setErr("");
        buscarPorTitulo({ titulo: q, page, size })
            .then((data) => { if (alive) setPageData(data); })
            .catch((e) => { if (alive) setErr(e.message || "Error en la búsqueda"); })
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, [q, page]);

    return (
        <section className="games-section">
            <div className="games-header">
                <h2>🔎 Resultados para “{q}”</h2>
            </div>

            {!q ? (
                <p>Ingresá un término en la búsqueda.</p>
            ) : loading ? (
                <p>Buscando…</p>
            ) : err ? (
                <p style={{ color: "#b91c1c" }}>{err}</p>
            ) : !pageData || pageData.content?.length === 0 ? (
                <p>No se encontraron resultados.</p>
            ) : (
                <>
                    <div className="games-grid">
                        {pageData.content.map((p) => (
                            <GameCard key={p.id} producto={p} onClick={() => navigate(`/producto/${p.id}`)} />
                        ))}
                    </div>

                    <div className="pager">
                        <button disabled={page === 0} onClick={() => setPage((n) => Math.max(0, n - 1))}>
                            ◀ Anterior
                        </button>
                        <span>
                            Página {pageData.number + 1} de {pageData.totalPages || 1}
                        </span>
                        <button disabled={pageData.last} onClick={() => setPage((n) => n + 1)}>
                            Siguiente ▶
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
