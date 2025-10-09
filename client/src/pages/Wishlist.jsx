import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getWishlist,
    removeWishlistItem,
    clearWishlist,
    addAllToCart,
} from "../api/wishlist";
import { addItemToCart, createCartIfMissing } from "../api/cart";
import { getProducto } from "../api/products";
import WishlistItemRow from "../components/wishlist/wishlistItemRow";
import StatusMessage from "../components/common/StatusMessage";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/wishlist.css";

export default function Wishlist() {
    const { user } = useAuth();
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState(null);
    const [enrichedItems, setEnrichedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [msg, setMsg] = useState("");

    const load = async () => {
        if (!token || !usuarioId) return;
        try {
            setLoading(true);
            setMsg(""); // Limpiar mensajes previos

            // Intentar obtener la wishlist (ahora maneja el caso de no existir)
            const data = await getWishlist(token, usuarioId);
            setWishlist(data);

            // Enriquecer items con información de productos (imágenes)
            if (data?.items?.length > 0) {
                const enriched = await Promise.all(
                    data.items.map(async (item) => {
                        try {
                            const producto = await getProducto(item.productoId);
                            // Obtener la imagen principal del producto
                            let imagenUrl = producto.imagenUrl;
                            if (!imagenUrl && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
                                imagenUrl = producto.imagenes[0].url || producto.imagenes[0].imagenUrl;
                            }
                            return { ...item, imagenUrl, imagenes: producto.imagenes };
                        } catch (error) {
                            console.error(`Error al cargar producto ${item.productoId}:`, error);
                            return item; // Devolver item sin enriquecer si falla
                        }
                    })
                );
                setEnrichedItems(enriched);
            } else {
                setEnrichedItems([]);
            }
        } catch (e) {
            setMsg(String(e.message ?? e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && usuarioId) load();
    }, [token, usuarioId]);

    const onRemove = async (productoId) => {
        try {
            const updated = await removeWishlistItem(token, usuarioId, productoId);
            setWishlist(updated);
            // Remover el item de enrichedItems
            setEnrichedItems(prev => prev.filter(item => item.productoId !== productoId));
        } catch (e) {
            setMsg(String(e.message ?? e));
            load();
        }
    };

    const onClear = async () => {
        try {
            const updated = await clearWishlist(token, usuarioId);
            setWishlist(updated);
            setEnrichedItems([]);
            setMsg("Wishlist vaciada correctamente");
        } catch (e) {
            setMsg(String(e.message ?? e));
        }
    };

    const onAddAllToCart = async () => {
        if (!enrichedItems.length) {
            setMsg("No hay productos en la wishlist para agregar");
            return;
        }

        try {
            setAddingToCart(true);
            setMsg("");

            // Asegurar que el carrito existe
            await createCartIfMissing(token, usuarioId);

            // Agregar cada item al carrito
            let successCount = 0;
            let failCount = 0;

            // Primero agregar todos al carrito
            for (const item of enrichedItems) {
                try {
                    await addItemToCart(token, usuarioId, {
                        productoId: item.productoId,
                        cantidad: 1
                    });
                    successCount++;
                } catch (error) {
                    console.error(`Error al agregar ${item.productoTitulo}:`, error);
                    failCount++;
                }
            }

            // Si se agregaron algunos productos con éxito, vaciar la wishlist
            if (successCount > 0) {
                try {
                    await clearWishlist(token, usuarioId);
                    setMsg(`${successCount} producto(s) agregado(s) al carrito y wishlist vaciada${failCount > 0 ? ` (${failCount} fallaron)` : ''}`);
                    navigate('/cart'); // Redirigir al carrito después de agregar los productos
                } catch (error) {
                    setMsg(`${successCount} producto(s) agregado(s) al carrito pero no se pudo vaciar la wishlist`);
                }
            } else {
                setMsg("No se pudo agregar ningún producto al carrito");
            }
        } catch (e) {
            setMsg(String(e.message ?? e));
        } finally {
            setAddingToCart(false);
        }
    };

    if (!token) {
        return (
            <StatusMessage
                type="error"
                title="Acceso Denegado"
                message="Debes iniciar sesión para ver tu lista de deseos"
                linkTo="/login"
                linkText="Iniciar Sesión"
            />
        );
    }

    if (!usuarioId) {
        return (
            <StatusMessage
                type="error"
                title="Error de Sesión"
                message="No se detectó tu usuarioId en la sesión"
                linkTo="/login"
                linkText="Iniciar Sesión"
            />
        );
    }

    if (!buyer) {
        return (
            <StatusMessage
                type="error"
                title="Permisos Insuficientes"
                message="Tu cuenta no tiene permisos de comprador"
                linkTo="/login"
                linkText="Iniciar Sesión"
            />
        );
    }

    return (
        <div className="wishlist-page container">
            <h2>Tu Wishlist</h2>
            {msg && <div className="alert">{msg}</div>}

            <div className="wishlist-container">
                {loading ? (
                    <div className="skeleton">Cargando wishlist…</div>
                ) : !enrichedItems.length ? (
                    <div className="empty">Tu wishlist está vacía</div>
                ) : (
                    <>
                        <div className="wishlist-items">
                            {enrichedItems.map((item) => (
                                <WishlistItemRow
                                    key={`${item.productoId}`}
                                    item={item}
                                    onRemove={onRemove}
                                />
                            ))}
                        </div>

                        <div className="wishlist-actions">
                            <button
                                className="btn btn--primary btn--block"
                                onClick={onAddAllToCart}
                                disabled={addingToCart}
                            >
                                {addingToCart ? "Agregando..." : "Agregar todos al carrito"}
                            </button>
                            <button
                                className="btn btn--ghost btn--block"
                                onClick={onClear}
                            >
                                Vaciar wishlist
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
