import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { isBuyer, getUserId } from "../../utils/userUtils";
import { addItemToCart, createCartIfMissing } from "../../api/cart";
import { addItemToWishlist } from "../../api/wishlist";

// Muestra título, precio, descuento (si aplica) e imagen del producto
export default function GameCard({ producto, onClick }) {
    if (!producto) return null;

    const { user } = useAuth();
    const { refreshCartCount, refreshWishlistCount } = useCartWishlist();
    const [cartLoading, setCartLoading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const {
        id,
        titulo,
        precio,
        tieneDescuento,
        precioConDescuento,
        imagenUrl,
        imagenes,
    } = producto;

    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    // Imagen: prioriza imagenUrl del DTO, si no, primera imagen de la lista
    const imgFromList =
        (Array.isArray(imagenes) && imagenes.length > 0 && (imagenes[0].url || imagenes[0].imagenUrl)) || null;

    const img = imagenUrl || imgFromList || "/promos/quality.jpg";

    const formatMoney = (n) =>
        typeof n === "number" ? `$${n.toFixed(2)}` : "$-";

    const precioFinal = tieneDescuento ? precioConDescuento : precio;

    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Evitar que se ejecute onClick del card
        
        if (!token) return alert("Debes iniciar sesión.");
        if (!buyer) return alert("Tu cuenta no tiene permisos de COMPRADOR.");
        if (!usuarioId) return alert("No se detectó tu usuarioId en la sesión.");

        try {
            setCartLoading(true);
            await createCartIfMissing(token, usuarioId);
            await addItemToCart(token, usuarioId, {
                productoId: id,
                cantidad: 1,
                precio: precioFinal
            });

            setTimeout(async () => {
                await refreshCartCount();
            }, 300);

            alert("¡Producto agregado al carrito!");
        } catch (e) {
            alert(String(e.message ?? e));
        } finally {
            setCartLoading(false);
        }
    };

    const handleAddToWishlist = async (e) => {
        e.stopPropagation(); // Evitar que se ejecute onClick del card
        
        if (!token) return alert("Debes iniciar sesión.");
        if (!buyer) return alert("Tu cuenta no tiene permisos de COMPRADOR.");
        if (!usuarioId) return alert("No se detectó tu usuarioId en la sesión.");

        try {
            setWishlistLoading(true);
            await addItemToWishlist(token, usuarioId, id, titulo);

            setTimeout(async () => {
                await refreshWishlistCount();
            }, 300);

            alert("¡Producto agregado a tu wishlist!");
        } catch (e) {
            alert(String(e.message ?? e));
        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <article className="game-card" onClick={onClick} style={{ cursor: "pointer" }}>
            <img src={img} alt={titulo} />
            <h3 title={titulo}>{titulo}</h3>

            {tieneDescuento && typeof precioConDescuento === "number" ? (
                <p>
                    <span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: 8 }}>
                        {formatMoney(precio)}
                    </span>
                    <span style={{ color: "#2563eb", fontWeight: 700 }}>
                        {formatMoney(precioConDescuento)}
                    </span>
                </p>
            ) : (
                <p style={{ color: "#2563eb", fontWeight: 700 }}>{formatMoney(precio)}</p>
            )}

            {/* Botones de acción */}
            <div className="game-card-actions" style={{ 
                display: "flex", 
                gap: "8px", 
                marginTop: "12px",
                justifyContent: "center"
            }}>
                <button 
                    className="btn btn--primary btn--sm" 
                    disabled={cartLoading || !buyer}
                    onClick={handleAddToCart}
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                    {cartLoading ? "..." : "🛒"}
                </button>
                <button 
                    className="btn btn--ghost btn--sm" 
                    disabled={wishlistLoading || !buyer}
                    onClick={handleAddToWishlist}
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                    {wishlistLoading ? "..." : "♥"}
                </button>
            </div>
        </article>
    );
}
