import { useState } from "react";
import { addItemToWishlist } from "../../api/wishlist";
import { useAuth } from "../../context/AuthContext";
import { isBuyer, getUserId } from "../../utils/userUtils";
import { useNavigate } from "react-router-dom";

export default function AddToWishlistButton({ productoId, producto, onAdded }) {
    const { user } = useAuth();
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdd = async () => {
        if (!token) return alert("Debes iniciar sesión.");
        if (!buyer) return alert("Tu cuenta no tiene permisos de COMPRADOR.");
        if (!usuarioId) return alert("No se detectó tu usuarioId en la sesión.");

        try {
            setLoading(true);
            // addItemToWishlist ya maneja la creación automática de la wishlist
            await addItemToWishlist(token, usuarioId, productoId, producto?.titulo);
            onAdded?.();
            navigate('/wishlist');
        } catch (e) {
            const errorMessage = e.message || "Error desconocido";

            if (errorMessage.includes("Error interno del servidor")) {
                alert("⚠️ El servidor está experimentando problemas temporales. Por favor, inténtalo en unos minutos.");
            } else if (errorMessage.includes("Error de conexión")) {
                alert("🌐 No se pudo conectar al servidor. Verifica tu conexión a internet.");
            } else {
                alert(errorMessage);
            }
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
