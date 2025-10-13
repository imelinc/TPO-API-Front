import { useState, useEffect } from "react";
import StatusMessage from "../common/StatusMessage";

const API_URL = "http://localhost:8080";

export default function AdminOrdersList() {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        totalPages: 0,
        totalElements: 0
    });

    const fetchAllOrdenes = async (page = 0) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/ordenes?page=${page}&size=20`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Error al cargar órdenes");
            }

            const data = await response.json();
            setOrdenes(data.content || []);
            setPagination({
                page: data.number,
                totalPages: data.totalPages,
                totalElements: data.totalElements
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Error al cargar órdenes"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrdenes();
    }, []);

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(precio);
    };

    const getEstadoBadgeClass = (estado) => {
        switch (estado) {
            case "COMPLETADA": return "estado-badge estado-completada";
            case "PENDIENTE": return "estado-badge estado-pendiente";
            case "CANCELADA": return "estado-badge estado-cancelada";
            default: return "estado-badge";
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return <div className="loading-state">Cargando órdenes...</div>;
    }

    return (
        <div className="admin-orders-container">
            {message && (
                <StatusMessage
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            <div className="orders-stats">
                <p>Total de órdenes: <strong>{pagination.totalElements}</strong></p>
                <p>
                    Total vendido: <strong>
                        {formatPrecio(ordenes.reduce((sum, orden) => sum + orden.total, 0))}
                    </strong>
                </p>
            </div>

            <div className="orders-list">
                {ordenes.map(orden => (
                    <div key={orden.id} className="order-card-admin">
                        <div
                            className="order-header-admin"
                            onClick={() => toggleOrderDetails(orden.id)}
                        >
                            <div className="order-info">
                                <h3>Orden #{orden.id}</h3>
                                <p className="order-date">{formatFecha(orden.fecha)}</p>
                                <p className="order-user">Usuario ID: {orden.usuarioId}</p>
                            </div>
                            <div className="order-summary">
                                <span className={getEstadoBadgeClass(orden.estado)}>
                                    {orden.estado}
                                </span>
                                <p className="order-total">{formatPrecio(orden.total)}</p>
                                <span className="order-items-count">
                                    {orden.items?.length || 0} producto(s)
                                </span>
                            </div>
                            <button className="expand-btn">
                                {expandedOrder === orden.id ? "▼" : "▶"}
                            </button>
                        </div>

                        {expandedOrder === orden.id && orden.items && (
                            <div className="order-items-admin">
                                <h4>Detalle de productos:</h4>
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unit.</th>
                                            <th>Descuento</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orden.items.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="item-title">
                                                        {item.productoTitulo || item.titulo}
                                                        <span className="item-id">
                                                            (ID: {item.productoId || item.idProducto})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-center">{item.cantidad}</td>
                                                <td>{formatPrecio(item.precio || item.precioUnitario)}</td>
                                                <td className="text-center">
                                                    {item.descuentoAplicado > 0 ? (
                                                        <span className="descuento-aplicado">
                                                            -{formatPrecio(item.descuentoAplicado)}
                                                        </span>
                                                    ) : (
                                                        <span className="sin-descuento">-</span>
                                                    )}
                                                </td>
                                                <td className="subtotal-cell">
                                                    {formatPrecio(item.subtotal)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="total-row">
                                            <td colSpan="4" className="text-right">
                                                <strong>Total:</strong>
                                            </td>
                                            <td className="total-cell">
                                                <strong>{formatPrecio(orden.total)}</strong>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => fetchAllOrdenes(pagination.page - 1)}
                        disabled={pagination.page === 0}
                        className="pagination-btn"
                    >
                        ← Anterior
                    </button>
                    <span className="pagination-info">
                        Página {pagination.page + 1} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => fetchAllOrdenes(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className="pagination-btn"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}
