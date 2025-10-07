import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducto } from "../api/products";
import "../styles/productDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

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

    const imgPrincipal = useMemo(() => {
        if (!data) return null;
        const firstFromList =
            Array.isArray(data.imagenes) && data.imagenes.length > 0
                ? (data.imagenes[0].url || data.imagenes[0].imagenUrl)
                : null;
        return data.imagenUrl || firstFromList || "/promos/quality.jpg";
    }, [data]);

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
                {/* Imagen principal y miniaturas */}
                <div className="pd-media">
                    <img className="pd-cover" src={imgPrincipal} alt={titulo} />
                    {Array.isArray(data.imagenes) && data.imagenes.length > 1 && (
                        <div className="pd-thumbs">
                            {data.imagenes.map((im, i) => {
                                const url = im.url || im.imagenUrl;
                                if (!url) return null;
                                return <img key={i} src={url} alt={`${titulo} ${i + 1}`} className="pd-thumb" />;
                            })}
                        </div>
                    )}
                </div>

                {/* Info */}
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

                    <div className="pd-actions">
                        <button className="btn-primary" disabled={sinStock} onClick={() => navigate("/cart")}>
                            {sinStock ? "Sin stock" : "Agregar al carrito"}
                        </button>
                        <button className="btn-outline" onClick={() => navigate("/wishlist")}>Agregar a Wishlist</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
