import { useState } from "react";
import { addItemToWishlist } from "../../api/wishlist";
import { useAuth } from "../../context/AuthContext";
import { isBuyer, getUserId } from "../../utils/userUtils";

export default function AddToWishlistButton({ productoId, onAdded }) {
    const { user } = useAuth();
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!token) return alert("Debes iniciar sesión.");
        if (!buyer) return alert("Tu cuenta no tiene permisos de COMPRADOR.");
        if (!usuarioId) return alert("No se detectó tu usuarioId en la sesión.");

        try {
            setLoading(true);
            // addItemToWishlist ya maneja la creación automática de la wishlist
            await addItemToWishlist(token, usuarioId, productoId);
            alert("Producto agregado a la wishlist");
            onAdded?.();
        } catch (e) {
            alert(String(e.message ?? e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button className="btn btn--ghost" disabled={loading} onClick={handleAdd}>
            {loading ? "Agregando..." : "♥ Wishlist"}
        </button>
    );
}
