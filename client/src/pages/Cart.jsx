import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    createCartIfMissing,
    getCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    validateCheckout,
    doCheckout,
} from "../api/cart";
import CartItemRow from "../components/cart/cartItemRow";
import CartSummary from "../components/cart/cartSummary";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/cart.css";

export default function Cart() {
    const { user } = useAuth();
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    const [carrito, setCarrito] = useState(null);
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
        } catch (e) {
            setMsg(String(e.message ?? e));
            load();
        }
    };

    const onRemove = async (productoId) => {
        try {
            const updated = await removeCartItem(token, usuarioId, productoId);
            setCarrito(updated);
        } catch (e) {
            setMsg(String(e.message ?? e));
            load();
        }
    };

    const onClear = async () => {
        try {
            const updated = await clearCart(token, usuarioId);
            setCarrito(updated);
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
            setCheckingOut(true);
            const orden = await doCheckout(token, usuarioId);
            setMsg(`¡Compra completada! Orden #${orden?.id ?? ""}`);
            await load();
        } catch (e) {
            setMsg(String(e.message ?? e));
        } finally {
            setCheckingOut(false);
        }
    };

    if (!token) return <div className="cart-page container">Debes iniciar sesión.</div>;
    if (!usuarioId) return <div className="cart-page container">No se detectó tu usuarioId en la sesión.</div>;
    if (!buyer) return <div className="cart-page container">Tu cuenta no tiene permisos de COMPRADOR.</div>;

    const items = carrito?.items ?? [];

    return (
        <div className="cart-page container">
            <h2>Tu carrito</h2>
            {msg && <div className="alert">{msg}</div>}

            <div className="cart-grid">
                <div className="cart-left">
                    {loading ? (
                        <div className="skeleton">Cargando carrito…</div>
                    ) : !items.length ? (
                        <div className="empty">Tu carrito está vacío</div>
                    ) : (
                        items.map((item) => (
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
                        carrito={carrito}
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
