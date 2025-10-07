import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducto } from "../api/products";
import "../styles/productDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // Galería
    const [activeIdx, setActiveIdx] = useState(0);

    // Lightbox
    const [isOpen, setIsOpen] = useState(false);
    const openLightbox = (idx) => { setActiveIdx(idx); setIsOpen(true); };
    const closeLightbox = () => setIsOpen(false);

    const goPrev = useCallback(() => {
        setActiveIdx((p) => (p - 1 + images.length) % images.length);
    }, []);

    const goNext = useCallback(() => {
        setActiveIdx((p) => (p + 1) % images.length);
    }, []);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setErr("");
        getProducto(id)
            .then((d) => alive && setData(d))
            .catch((e) => alive && setErr(e.message || "No se pudo cargar el producto"))
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, [id]);

    // lista de imagenes
    const images = useMemo(() => {
        if (!data) return [];
        const fromList = (Array.isArray(data.imagenes) ? data.imagenes : [])
            .map(im => im?.url || im?.imagenUrl)
            .filter(Boolean);
        const first = data.imagenUrl ? [data.imagenUrl] : [];
        const all = [...first, ...fromList];
        // dedup
        return Array.from(new Set(all));
    }, [data]);

    // Imagen principal visible
    const imgPrincipal = images[activeIdx];

    const formatMoney = (n) => (typeof n === "number" ? `$${n.toFixed(2)}` : "$-");

    if (loading) return <section className="pd-wrap"><p>Cargando producto…</p></section>;
    if (err) return <section className="pd-wrap"><p className="pd-error">{err}</p></section>;
    if (!data) return null;

    const {
        titulo, descripcion, precio, tieneDescuento, precioConDescuento,
        porcentajeDescuento, categoriaNombre, stock, vendedorNombre
    } = data;

    const sinStock = typeof stock === "number" ? stock <= 0 : false;

    return (
        <section className="pd-wrap">
            <div className="pd-header">
                <button className="pd-back" onClick={() => navigate(-1)}>Volver</button>
            </div>

            <div className="pd-grid">
                <div className="pd-media">
                    <div
                        className="pd-mainWrap"
                        onClick={() => openLightbox(activeIdx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(activeIdx)}
                        aria-label="Abrir imagen en pantalla completa"
                    >
                        <img className="pd-cover" src={imgPrincipal} alt={titulo} />
                    </div>

                    {images.length > 1 && (
                        <div className="pd-thumbs">
                            {images.map((url, i) => (
                                <button
                                    key={url + i}
                                    className={`pd-thumbBtn ${i === activeIdx ? "is-active" : ""}`}
                                    onClick={() => setActiveIdx(i)}
                                    aria-label={`Ver imagen ${i + 1}`}
                                >
                                    <img src={url} alt={`${titulo} ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pd-info">
                    <h1 className="pd-title">{titulo}</h1>

                    <div className="pd-meta">
                        {categoriaNombre && <span className="pd-chip">Categoría: {categoriaNombre}</span>}
                        {typeof stock === "number" && (
                            <span className={`pd-chip ${sinStock ? "stock-out" : "stock-ok"}`}>
                                {sinStock ? "Sin stock" : `Stock: ${stock}`}
                            </span>
                        )}
                        {vendedorNombre && <span className="pd-chip">Vendedor: {vendedorNombre}</span>}
                    </div>

                    <div className="pd-price">
                        {tieneDescuento && typeof precioConDescuento === "number" ? (
                            <>
                                <span className="pd-old">{formatMoney(precio)}</span>
                                <span className="pd-new">{formatMoney(precioConDescuento)}</span>
                                {porcentajeDescuento ? <span className="pd-off">-{porcentajeDescuento}%</span> : null}
                            </>
                        ) : (
                            <span className="pd-new">{formatMoney(precio)}</span>
                        )}
                    </div>

                    <p className="pd-desc">{descripcion}</p>

                    {/* ACCIONES: mismo ancho, wishlist debajo y blanco */}
                    <div className="pd-actions">
                        <button className="btn-primary" disabled={sinStock} onClick={() => navigate("/cart")}>
                            {sinStock ? "Sin stock" : "Agregar al carrito"}
                        </button>
                        <button className="btn-outline" onClick={() => navigate("/wishlist")}>
                            Agregar a Wishlist
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="lb-overlay" onClick={closeLightbox} aria-modal="true" role="dialog">
                    <div className="lb-content" onClick={(e) => e.stopPropagation()}>
                        <img className="lb-image" src={images[activeIdx]} alt={`${titulo} ampliada`} />
                        {images.length > 1 && (
                            <>
                                <button className="lb-nav lb-prev" onClick={goPrev} aria-label="Imagen anterior">‹</button>
                                <button className="lb-nav lb-next" onClick={goNext} aria-label="Imagen siguiente">›</button>
                            </>
                        )}
                        <button className="lb-close" onClick={closeLightbox} aria-label="Cerrar">×</button>

                        {images.length > 1 && (
                            <div className="lb-strip">
                                {images.map((src, idx) => (
                                    <button
                                        key={src + idx}
                                        className={`lb-thumb ${idx === activeIdx ? "is-active" : ""}`}
                                        onClick={() => setActiveIdx(idx)}
                                        aria-label={`Ir a imagen ${idx + 1}`}
                                    >
                                        <img src={src} alt={`miniatura ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
