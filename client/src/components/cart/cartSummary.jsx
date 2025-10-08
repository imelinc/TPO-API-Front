export default function CartSummary({ carrito, onClear, onCheckout, validating, checkingOut }) {
    const items = carrito?.items ?? [];
    const subtotal = items.reduce((acc, it) => acc + (it.subtotal ?? 0), 0);
    const total = carrito?.total ?? subtotal;

    return (
        <div className="cart-summary">
            <h3>Resumen</h3>
            <div className="cart-summary__row">
                <span>Ítems</span>
                <span>{items.reduce((n, it) => n + (it.cantidad ?? 0), 0)}</span>
            </div>
            <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>USD {subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>USD {total.toFixed(2)}</span>
            </div>

            <button className="btn btn--primary btn--block" disabled={validating || checkingOut || items.length === 0} onClick={onCheckout}>
                {checkingOut ? "Procesando…" : "Ir a pagar"}
            </button>
            <button className="btn btn--ghost btn--block" disabled={checkingOut || items.length === 0} onClick={onClear}>
                Vaciar carrito
            </button>
        </div>
    );
}
