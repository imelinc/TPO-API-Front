import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import {
    fetchWishlist,
    removeFromWishlist,
    clearAllWishlist,
    moveAllToCart,
    selectWishlistItems,
    selectWishlistLoading,
    selectMovingToCart,
    selectWishlistError,
    selectMoveResult,
    clearMoveResult,
} from "../redux/slices/wishlistSlice";
import { fetchCart } from "../redux/slices/cartSlice";
import WishlistItemRow from "../components/wishlist/wishlistItemRow";
import StatusMessage from "../components/common/StatusMessage";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/wishlist.css";

export default function Wishlist() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const enrichedItems = useAppSelector(selectWishlistItems);
    const loading = useAppSelector(selectWishlistLoading);
    const movingToCart = useAppSelector(selectMovingToCart);
    const error = useAppSelector(selectWishlistError);
    const moveResult = useAppSelector(selectMoveResult);
    
    // Derivar valores del usuario
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    // Cargar wishlist al montar el componente
    useEffect(() => {
        if (token && usuarioId) {
            dispatch(fetchWishlist());
        }
    }, [token, usuarioId, dispatch]);

    // Mostrar mensaje cuando se complete mover al carrito
    useEffect(() => {
        if (moveResult) {
            const { successCount, failCount } = moveResult;
            if (successCount > 0) {
                // También refrescar el carrito para actualizar el count
                dispatch(fetchCart());
            }
            // Limpiar el resultado después de mostrarlo
            setTimeout(() => {
                dispatch(clearMoveResult());
            }, 3000);
        }
    }, [moveResult, dispatch]);

    const onRemove = (productoId) => {
        dispatch(removeFromWishlist(productoId));
    };

    const onClear = () => {
        dispatch(clearAllWishlist());
    };

    const onAddAllToCart = async () => {
        if (!enrichedItems.length) {
            return;
        }

        const result = await dispatch(moveAllToCart());
        
        if (result.type === 'wishlist/moveAllToCart/fulfilled') {
            // Redirigir al carrito después de mover exitosamente
            navigate('/cart');
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
            {error && <div className="alert error">{error}</div>}
            {moveResult && (
                <div className="alert success">
                    {moveResult.successCount} producto(s) agregado(s) al carrito
                    {moveResult.failCount > 0 && ` (${moveResult.failCount} fallaron)`}
                </div>
            )}

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
                                disabled={movingToCart}
                            >
                                {movingToCart ? "Agregando..." : "Agregar todos al carrito"}
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
