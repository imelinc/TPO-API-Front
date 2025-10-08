export default function CartItemRow({ item, onQtyChange, onRemove }) {
    const titulo = item.productoTitulo;
    const unit = item.precioUnitario;
    const qty = item.cantidad;
    const subtotal = item.subtotal;

    return (
        <div className="cart-row">
            <div className="cart-row__img--placeholder">{titulo?.[0] ?? "J"}</div>

            <div className="cart-row__info">
                <h4 className="cart-row__title">{titulo}</h4>
                <div className="cart-row__meta">
                    <span className="cart-row__price">USD {unit.toFixed(2)}</span>
                </div>

                <div className="cart-row__actions">
                    <div className="qty">
                        <button
                            className="qty__btn"
                            onClick={() => onQtyChange(item.productoId, Math.max(1, qty - 1))}
                        >
                            −
                        </button>
                        <input
                            className="qty__input"
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => {
                                const next = Math.max(1, Number(e.target.value || 1));
                                onQtyChange(item.productoId, next);
                            }}
                        />
                        <button
                            className="qty__btn"
                            onClick={() => onQtyChange(item.productoId, qty + 1)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="btn btn--link btn--danger"
                        onClick={() => onRemove(item.productoId)}
                    >
                        Quitar
                    </button>
                </div>
            </div>

            <div className="cart-row__subtotal">USD {subtotal.toFixed(2)}</div>
        </div>
    );
}
