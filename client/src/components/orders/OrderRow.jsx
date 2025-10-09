import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrderItems } from "../../api/orders";

export default function OrderRow({ order }) {
    const { user } = useAuth();
    const token = user?.token;
    const [expanded, setExpanded] = useState(false);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const formatPrice = (price) => {
        if (typeof price !== 'number') return '0,00';
        return price.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleExpanded = async () => {
        if (!expanded && items.length === 0 && !loadingItems) {
            // Cargar items la primera vez que se expande
            setLoadingItems(true);
            try {
                const orderItems = await getOrderItems(token, order.itemIds || []);
                setItems(orderItems);
            } catch (error) {
                console.error('Error loading items:', error);
            } finally {
                setLoadingItems(false);
            }
        }
        setExpanded(!expanded);
    };

    return (
        <div className="order-row">
            <div
                className="order-header"
                onClick={toggleExpanded}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpanded();
                    }
                }}
            >
                <div className="order-info">
                    <h3 className="order-id">Orden #{order.id}</h3>
                    <div className="order-meta">
                        <span className="order-date">{formatDate(order.fechaCreacion)}</span>
                        <span className={`order-status order-status--${order.estado?.toLowerCase()}`}>
                            {order.estado}
                        </span>
                    </div>
                </div>
                <div className="order-summary">
                    <div className="order-total">ARS ${formatPrice(order.total)}</div>
                    <div className="order-items-count">
                        {order.itemIds?.length || 0} item{(order.itemIds?.length || 0) !== 1 ? 's' : ''}
                    </div>
                </div>
                <div className="order-expand-icon">
                    <svg
                        className={`expand-icon ${expanded ? 'expanded' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </div>
            </div>

            {expanded && (
                <div className="order-details">
                    <div className="order-details-header">
                        <h4>Items de la orden:</h4>
                    </div>
                    {loadingItems ? (
                        <div className="order-items-loading">
                            <div className="loading-spinner"></div>
                            <span>Cargando items...</span>
                        </div>
                    ) : (
                        <div className="order-items-list">
                            {items.filter(Boolean).length > 0 ? (
                                items.filter(Boolean).map((item, index) => (
                                    <div key={item.id || index} className="order-item">
                                        <div className="order-item-info">
                                            <span className="order-item-title">
                                                {item.productoTitulo || item.titulo || `Item #${item.id || index}`}
                                            </span>
                                            <span className="order-item-quantity">
                                                Cantidad: {item.cantidad || 1}
                                            </span>
                                        </div>
                                        <div className="order-item-price">
                                            ARS ${formatPrice(item.precio || 0)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="order-items-empty">
                                    <span>No se pudieron cargar los detalles de los items</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}