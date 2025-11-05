import { useEffect } from "react";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import {
    fetchOrders,
    selectOrders,
    selectOrdersLoading,
    selectOrdersError
} from "../redux/slices/ordersSlice";
import { getUserId } from "../utils/userUtils";
import StatusMessage from "../components/common/StatusMessage";
import OrderRow from "../components/orders/OrderRow";
import "../styles/orders.css";

export default function Orders() {
    const dispatch = useAppDispatch();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const orders = useAppSelector(selectOrders);
    const loading = useAppSelector(selectOrdersLoading);
    const error = useAppSelector(selectOrdersError);
    
    const token = user?.token;
    const usuarioId = getUserId(user);

    useEffect(() => {
        if (token && usuarioId) {
            dispatch(fetchOrders());
        }
    }, [token, usuarioId, dispatch]);



    if (!user) {
        return (
            <StatusMessage
                type="error"
                title="Acceso Denegado"
                message="Debes iniciar sesión para ver tus órdenes"
                linkTo="/login"
                linkText="Iniciar Sesión"
            />
        );
    }

    if (user.rol !== "COMPRADOR" && user.rol !== "ADMIN") {
        return (
            <StatusMessage
                type="error"
                title="Acceso Denegado"
                message="Solo los compradores pueden ver sus órdenes"
                linkTo="/"
                linkText="Volver al Inicio"
            />
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <div className="orders-header">
                    <h2>Mis Órdenes</h2>
                    <p className="orders-subtitle">Historial de todas tus compras</p>
                </div>



                {error && (
                    <div className="alert alert--error">
                        {error}
                    </div>
                )}

                <div className="orders-content">
                    {loading ? (
                        <div className="orders-loading">
                            <div className="loading-spinner"></div>
                            <p>Cargando órdenes...</p>
                        </div>
                    ) : !Array.isArray(orders) || orders.length === 0 ? (
                        <div className="orders-empty">
                            <div className="empty-icon">📦</div>
                            <h3>No tienes órdenes aún</h3>
                            <p>Cuando realices tu primera compra, aparecerá aquí.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}