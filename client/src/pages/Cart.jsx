import { useEffect, useState } from "react";
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
import Toast from "../components/common/Toast";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/cart.css";

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ message: "", type: "success" });

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

    // Mostrar errores con Toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);

    // Mostrar errores de validación de checkout con Toast
    useEffect(() => {
        if (checkoutValidation && !checkoutValidation.valido) {
            setToastConfig({ message: checkoutValidation.mensaje, type: "error" });
            setShowToast(true);
        }
    }, [checkoutValidation]);

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
            <div className="cart-page container">
                <div className="alert error">
                    <strong>Acceso Denegado</strong>
                    <p>Debes iniciar sesión para ver tu carrito</p>
                    <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                </div>
            </div>
        );
    }

    if (!usuarioId) {
        return (
            <div className="cart-page container">
                <div className="alert error">
                    <strong>Error de Sesión</strong>
                    <p>No se detectó tu usuarioId en la sesión</p>
                    <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                </div>
            </div>
        );
    }

    if (!buyer) {
        return (
            <div className="cart-page container">
                <div className="alert error">
                    <strong>Permisos Insuficientes</strong>
                    <p>Tu cuenta no tiene permisos de comprador</p>
                    <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <h2>Tu carrito</h2>

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
