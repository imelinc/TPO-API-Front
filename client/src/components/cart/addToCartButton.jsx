import { useState } from "react";
import { addItemToCart } from "../api/cart";
import { useAuth } from "../context/AuthContext";
import { isBuyer, getUserId } from "../utils/auth";

export default function AddToCartButton({ productoId, cantidad = 1, onAdded }) {
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
            await addItemToCart(token, usuarioId, { productoId, cantidad });
            onAdded?.();
        } catch (e) {
            alert(String(e.message ?? e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button className="btn btn--primary" disabled={loading} onClick={handleAdd}>
            {loading ? "Agregando..." : "Agregar al carrito"}
        </button>
    );
}
