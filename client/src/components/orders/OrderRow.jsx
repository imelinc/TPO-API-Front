export default function OrderRow({ order }) {
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

    return (
        <div className="order-row">
            <div className="order-header">
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
            </div>
        </div>
    );
}