import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import {
    fetchCart,
    updateCartQty,
    removeFromCart,
    clearAllCart,
    validateCart,
    selectCartItems,
    selectCartLoading,
    selectCartValidating,
    selectCheckoutValidation,
    selectCartError,
} from "../redux/slices/cartSlice";
import CartItemRow from "../components/cart/cartItemRow";
import CartSummary from "../components/cart/cartSummary";
import StatusMessage from "../components/common/StatusMessage";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/cart.css";

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const enrichedItems = useAppSelector(selectCartItems);
    const loading = useAppSelector(selectCartLoading);
    const validating = useAppSelector(selectCartValidating);
    const checkoutValidation = useAppSelector(selectCheckoutValidation);
    const error = useAppSelector(selectCartError);
    
    // Derivar valores del usuario
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    // Cargar carrito al montar el componente
    useEffect(() => {
        if (token && usuarioId) {
            dispatch(fetchCart());
        }
    }, [token, usuarioId, dispatch]);

    const onQtyChange = (productoId, cantidad) => {
        dispatch(updateCartQty({ productoId, cantidad }));
    };

    const onRemove = (productoId) => {
        dispatch(removeFromCart(productoId));
    };

    const onClear = () => {
        dispatch(clearAllCart());
    };

    const onCheckout = async () => {
        const result = await dispatch(validateCart());
        if (result.payload?.valido) {
            navigate('/checkout');
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
            {error && <div className="alert error">{error}</div>}
            {checkoutValidation && !checkoutValidation.valido && (
                <div className="alert error">{checkoutValidation.mensaje}</div>
            )}

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
                    />
                </div>
            </div>
        </div>
    );
}
