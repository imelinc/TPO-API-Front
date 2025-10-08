import { useAuth } from "../../context/AuthContext";

export default function CartItemRow({ item, onQtyChange, onRemove }) {
    const { user } = useAuth();
    const token = user?.token;
    const titulo = item.productoTitulo;
    const unit = item.precioUnitario;
    const qty = item.cantidad;
    const subtotal = item.subtotal;

    // Función para construir la URL de la imagen con el token
    const getImageUrl = () => {
        // Si el item tiene un array de imágenes, usar la primera
        if (item.imagenes && Array.isArray(item.imagenes) && item.imagenes.length > 0) {
            const primeraImagen = item.imagenes[0];
            const url = primeraImagen.url || primeraImagen.imagenUrl;
            if (url) return url;
        }

        // Si hay una URL directa en el producto
        return item.imagenUrl || item.productoImagenUrl || item.imagen || "/showcase/quality.jpg";
    };

    const imageUrl = getImageUrl(); const renderImage = () => {
        const finalUrl = imageUrl.startsWith('http') || imageUrl.startsWith('/showcase')
            ? imageUrl
            : `http://localhost:8080/productos-publicos/imagen/${item.productoId}`;

        if (finalUrl.includes('localhost') && token) {
            return (
                <img
                    src={finalUrl}
                    alt={titulo}
                    className="cart-row__img"
                    style={{ background: '#f3f4f6' }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/showcase/quality.jpg";
                    }}
                />
            );
        }

        return (
            <img
                src={finalUrl}
                alt={titulo}
                className="cart-row__img"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/showcase/quality.jpg";
                }}
            />
        );
    };

    return (
        <div className="cart-row">
            {renderImage()}            <div className="cart-row__info">
                <h4 className="cart-row__title">{titulo}</h4>
                <div className="cart-row__meta">
                    <span className="cart-row__price">ARS ${unit.toLocaleString('es-AR')}</span>
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

            <div className="cart-row__subtotal">
                Subtotal: ARS ${subtotal.toLocaleString('es-AR')}
            </div>
        </div>
    );
}
