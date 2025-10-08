import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProducto } from "../api/products";
import { useAuth } from "../context/AuthContext";
import { addItemToCart, createCartIfMissing } from "../api/cart";
import { addItemToWishlist } from "../api/wishlist";
import { getUserId } from "../utils/userUtils";
import "../styles/productDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

    // Resetear el índice seleccionado cuando cambie el producto
    useEffect(() => {
        setSelectedImageIndex(0);
    }, [id]);

    const imgPrincipal = useMemo(() => {
        if (!data) return null;

        // Si hay imágenes, usar la seleccionada
        if (Array.isArray(data.imagenes) && data.imagenes.length > 0) {
            const selectedImg = data.imagenes[selectedImageIndex];
            if (selectedImg) {
                return selectedImg.url || selectedImg.imagenUrl;
            }
            // Fallback a la primera si el índice no existe
            const firstImg = data.imagenes[0];
            return firstImg.url || firstImg.imagenUrl;
        }

        return data.imagenUrl || "/promos/quality.jpg";
    }, [data, selectedImageIndex]);

    const formatMoney = (n) => (typeof n === "number" ? `$${n.toFixed(2)}` : "$-");

    if (loading) return <section className="pd-wrap"><p>Cargando producto…</p></section>;
    if (err) return <section className="pd-wrap"><p className="pd-error">{err}</p></section>;
    if (!data) return null;

    const {
        titulo, descripcion, precio, tieneDescuento, precioConDescuento,
        porcentajeDescuento, categoriaNombre, stock, vendedorNombre
    } = data;

    const sinStock = typeof stock === "number" ? stock <= 0 : false;

    const goLogin = (intent /* "cart" | "wishlist" */) => {
        const current = location.pathname + location.search;
        navigate(`/login?redirect=${encodeURIComponent(current)}&intent=${intent}`);
    };

    const handleAddToCart = async () => {
        if (!user) { goLogin("cart"); return; }

        const userId = getUserId(user);
        if (!userId) {
            alert("No se pudo identificar tu usuario");
            return;
        }

        // Obtener el token de acceso
        const token = user.token;
        if (!token) {
            alert("No se encontró el token de acceso");
            return;
        }

        try {
            // Asegurar que el carrito existe
            await createCartIfMissing(token, userId);
            // Agregar el producto
            await addItemToCart(token, userId, { productoId: id, cantidad: 1 });
            navigate("/cart");
        } catch (error) {
            alert("Error al agregar al carrito: " + error.message);
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) { goLogin("wishlist"); return; }

        const userId = getUserId(user);
        if (!userId) {
            alert("No se pudo identificar tu usuario");
            return;
        }

        const token = user.token;
        if (!token) {
            alert("No se encontró el token de acceso");
            return;
        }

        try {
            // addItemToWishlist ya maneja la creación automática de la wishlist
            await addItemToWishlist(token, userId, id);
            alert("Producto agregado a la wishlist");
        } catch (error) {
            alert("Error al agregar a la wishlist: " + error.message);
        }
    };
    // ----------------------------------------------------

    return (
        <section className="pd-wrap">
            <div className="pd-header">
                <button className="pd-back" onClick={() => navigate(-1)}>Volver</button>
            </div>

            <div className="pd-grid">
                {/* Media */}
                <div className="pd-media">
                    <img className="pd-cover" src={imgPrincipal} alt={titulo} />
                    {Array.isArray(data.imagenes) && data.imagenes.length > 1 && (
                        <div className="pd-thumbs">
                            {data.imagenes.map((im, i) => {
                                const url = im.url || im.imagenUrl;
                                if (!url) return null;
                                return (
                                    <button
                                        key={i}
                                        className={`pd-thumbBtn ${selectedImageIndex === i ? 'is-active' : ''}`}
                                        onClick={() => setSelectedImageIndex(i)}
                                        type="button"
                                    >
                                        <img src={url} alt={`${titulo} ${i + 1}`} />
                                    </button>
                                );
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
                        <button className="btn-primary" disabled={sinStock} onClick={handleAddToCart}>
                            {sinStock ? "Sin stock" : "Agregar al carrito"}
                        </button>
                        <button className="btn-outline" onClick={async () => {
                            if (!user) { goLogin("wishlist"); return; }

                            const userId = getUserId(user);
                            if (!userId) {
                                alert("No se pudo identificar tu usuario");
                                return;
                            }

                            const token = user.token;
                            if (!token) {
                                alert("No se encontró el token de acceso");
                                return;
                            }

                            try {
                                await addItemToWishlist(token, userId, id, titulo);
                                navigate('/wishlist');
                            } catch (error) {
                                alert("Error al agregar a la wishlist: " + error.message);
                            }
                        }}>
                            Agregar a Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
