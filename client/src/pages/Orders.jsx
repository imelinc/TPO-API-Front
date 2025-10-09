import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../api/orders";
import { getUserId } from "../utils/userUtils";
import StatusMessage from "../components/common/StatusMessage";
import OrderRow from "../components/orders/OrderRow";
import "../styles/orders.css";

export default function Orders() {
    const { user } = useAuth();
    const token = user?.token;
    const usuarioId = getUserId(user);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (token && usuarioId) {
            loadOrders();
        }
    }, [token, usuarioId]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getUserOrders(token, usuarioId);
            // La función getUserOrders ya extrae el array 'content'
            setOrders(data);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError(err.message || "Error al cargar las órdenes");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };



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