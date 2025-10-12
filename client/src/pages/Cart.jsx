import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useNavigate } from "react-router-dom";
import {
    createCartIfMissing,
    getCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    validateCheckout,
} from "../api/cart";
import { getProducto } from "../api/products";
import CartItemRow from "../components/cart/cartItemRow";
import CartSummary from "../components/cart/cartSummary";
import StatusMessage from "../components/common/StatusMessage";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/cart.css";

export default function Cart() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refreshCartCount } = useCartWishlist();
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    const [carrito, setCarrito] = useState(null);
    const [enrichedItems, setEnrichedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const [msg, setMsg] = useState("");

    const load = async () => {
        if (!token || !usuarioId) return;
        try {
            setLoading(true);
            await createCartIfMissing(token, usuarioId);
            const data = await getCart(token, usuarioId);
            setCarrito(data);

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

                            const precioBase = producto.precio || 0;
                            const tieneDescuento = producto.tieneDescuento;
                            const precioConDescuento = producto.precioConDescuento || 0;
                            const precioFinal = tieneDescuento ? precioConDescuento : precioBase;
                            const cantidad = item.cantidad || 0;
                            const subtotal = precioFinal * cantidad;

                            return {
                                ...item,
                                imagenUrl,
                                imagenes: producto.imagenes,
                                precio: precioBase,
                                precioConDescuento,
                                tieneDescuento,
                                subtotal,
                                porcentajeDescuento: producto.porcentajeDescuento
                            };
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

    const onQtyChange = async (productoId, cantidad) => {
        try {
            const updated = await updateCartItemQty(token, usuarioId, productoId, cantidad);
            setCarrito(updated);
            // Actualizar enrichedItems con la nueva cantidad
            setEnrichedItems(prev => prev.map(item =>
                item.productoId === productoId
                    ? {
                        ...item,
                        cantidad,
                        subtotal: (item.tieneDescuento ? item.precioConDescuento : item.precio) * cantidad
                    }
                    : item
            ));
        } catch (e) {
            setMsg(String(e.message ?? e));
            load();
        }
    };

    const onRemove = async (productoId) => {
        try {
            const updated = await removeCartItem(token, usuarioId, productoId);
            setCarrito(updated);
            // Remover el item de enrichedItems
            setEnrichedItems(prev => prev.filter(item => item.productoId !== productoId));
            // Refrescar contador
            await refreshCartCount();
        } catch (e) {
            setMsg(String(e.message ?? e));
            load();
        }
    };

    const onClear = async () => {
        try {
            const updated = await clearCart(token, usuarioId);
            setCarrito(updated);
            setEnrichedItems([]);
            // Refrescar contador
            await refreshCartCount();
        } catch (e) {
            setMsg(String(e.message ?? e));
        }
    };

    const onCheckout = async () => {
        try {
            setValidating(true);
            const { valido, mensaje } = await validateCheckout(token, usuarioId);
            setValidating(false);
            if (!valido) {
                setMsg(mensaje || "No se puede realizar el checkout");
                return;
            }
            // Redirigir a la página de checkout
            navigate('/checkout');
        } catch (e) {
            setMsg(String(e.message ?? e));
        }
    };

    if (!token) {
        return (
            <StatusMessage
                type="error"
                title="Acceso Denegado"
                message="Debes iniciar sesión para ver tu carrito"
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
        <div className="cart-page container">
            <h2>Tu carrito</h2>
            {msg && <div className="alert">{msg}</div>}

            <div className="cart-grid">
                <div className="cart-left">
                    {loading ? (
                        <div className="skeleton">Cargando carrito…</div>
                    ) : !enrichedItems.length ? (
                        <div className="empty">Tu carrito está vacío</div>
                    ) : (
                        enrichedItems.map((item) => (
                            <CartItemRow
                                key={`${item.productoId}`}
                                item={item}
                                onQtyChange={onQtyChange}
                                onRemove={onRemove}
                            />
                        ))
                    )}
                </div>

                <div className="cart-right">
                    <CartSummary
                        items={enrichedItems}
                        onClear={onClear}
                        onCheckout={onCheckout}
                        validating={validating}
                        checkingOut={checkingOut}
                    />
                </div>
            </div>
        </div>
    );
}
