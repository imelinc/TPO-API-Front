import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroShowcase from "../components/home/HeroShowcase";
import GameCard from "../components/games/gameCard";
import { getDisponibles } from "../api/products";

export default function Home() {
    const [pageData, setPageData] = useState(null); // Page<ProductoDTO>
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const size = 12;

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setErr("");
        getDisponibles({ page, size })
            .then((data) => { if (alive) setPageData(data); })
            .catch((e) => { if (alive) setErr(e.message || "Error cargando productos"); })
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, [page]);

    return (
        <>
            <HeroShowcase />

            <section id="games-section" className="games-section">
                <div className="games-header">
                    <h2>Juegos destacados</h2>
                    <p>Explorá los títulos más populares y los últimos lanzamientos de PressPlay.</p>
                </div>

                {loading ? (
                    <p>Cargando juegos disponibles…</p>
                ) : err ? (
                    <p style={{ color: "#b91c1c" }}>{err}</p>
                ) : !pageData || pageData.content?.length === 0 ? (
                    <p>No hay productos disponibles.</p>
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
        </>
    );
}
