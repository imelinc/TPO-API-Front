import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../api/cart";
import { getWishlist } from "../api/wishlist";

/**
 * Hook personalizado que obtiene las cantidades de items en carrito y wishlist
 * Se actualiza cuando cambia el usuario o cuando se monta el componente
 */
export function useCartAndWishlistCount() {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Solo obtener cantidades si hay usuario logueado y no es vendedor
        if (!user || user.rol === "VENDEDOR" || user.rol === "ADMIN") {
            setCartCount(0);
            setWishlistCount(0);
            return;
        }

        const fetchCounts = async () => {
            setLoading(true);
            try {
                // Obtener carrito
                const cartPromise = getCart(user.token, user.id)
                    .then((cart) => {
                        const count = cart?.items?.length || 0;
                        setCartCount(count);
                    })
                    .catch(() => setCartCount(0)); // Si falla, mostrar 0

                // Obtener wishlist
                const wishlistPromise = getWishlist(user.token, user.id)
                    .then((wishlist) => {
                        const count = wishlist?.items?.length || 0;
                        setWishlistCount(count);
                    })
                    .catch(() => setWishlistCount(0)); // Si falla, mostrar 0

                // Esperar ambas promesas
                await Promise.all([cartPromise, wishlistPromise]);
            } catch (err) {
                console.error("Error obteniendo cantidades:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, [user]);

    // Función para refrescar manualmente las cantidades
    const refreshCounts = async () => {
        if (!user || user.rol === "VENDEDOR" || user.rol === "ADMIN") {
            return;
        }

        try {
            const [cart, wishlist] = await Promise.all([
                getCart(user.token, user.id).catch(() => null),
                getWishlist(user.token, user.id).catch(() => null)
            ]);

            setCartCount(cart?.items?.length || 0);
            setWishlistCount(wishlist?.items?.length || 0);
        } catch (err) {
            console.error("Error refreshing counts:", err);
        }
    };

    return { cartCount, wishlistCount, loading, refreshCounts };
}
