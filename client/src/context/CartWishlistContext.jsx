import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getCart } from "../api/cart";
import { getWishlist } from "../api/wishlist";

const CartWishlistContext = createContext();

export function CartWishlistProvider({ children }) {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Función para obtener las cantidades del backend
    const fetchCounts = useCallback(async () => {
        // Solo obtener cantidades si hay usuario logueado y no es vendedor
        if (!user || user.rol === "VENDEDOR" || user.rol === "ADMIN") {
            setCartCount(0);
            setWishlistCount(0);
            return;
        }

        setLoading(true);
        try {
            // Obtener carrito y wishlist en paralelo
            const [cartData, wishlistData] = await Promise.all([
                getCart(user.token, user.id).catch(() => null),
                getWishlist(user.token, user.id).catch(() => null)
            ]);

            // Actualizar counts - manejar cuando items es null o undefined
            const newCartCount = Array.isArray(cartData?.items) ? cartData.items.length : 0;
            const newWishlistCount = Array.isArray(wishlistData?.items) ? wishlistData.items.length : 0;

            setCartCount(newCartCount);
            setWishlistCount(newWishlistCount);
        } catch (err) {
            console.error("Error obteniendo cantidades:", err);
            setCartCount(0);
            setWishlistCount(0);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Cargar counts cuando cambia el usuario
    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);

    // Funciones para actualizar manualmente
    const refreshCartCount = useCallback(async () => {
        if (!user || user.rol === "VENDEDOR" || user.rol === "ADMIN") {
            setCartCount(0);
            return;
        }

        try {
            const cartData = await getCart(user.token, user.id).catch(() => ({ items: [] }));
            const count = Array.isArray(cartData?.items) ? cartData.items.length : 0;
            setCartCount(count);
        } catch (err) {
            console.error("Error refreshing cart count:", err);
            setCartCount(0);
        }
    }, [user]);

    const refreshWishlistCount = useCallback(async () => {
        if (!user || user.rol === "VENDEDOR" || user.rol === "ADMIN") {
            setWishlistCount(0);
            return;
        }

        try {
            const wishlistData = await getWishlist(user.token, user.id).catch(() => ({ items: [] }));
            const count = Array.isArray(wishlistData?.items) ? wishlistData.items.length : 0;
            setWishlistCount(count);
        } catch (err) {
            console.error("Error refreshing wishlist count:", err);
            setWishlistCount(0);
        }
    }, [user]);

    // Función para refrescar ambos
    const refreshCounts = useCallback(() => {
        fetchCounts();
    }, [fetchCounts]);

    const value = {
        cartCount,
        wishlistCount,
        loading,
        refreshCartCount,
        refreshWishlistCount,
        refreshCounts
    };

    return (
        <CartWishlistContext.Provider value={value}>
            {children}
        </CartWishlistContext.Provider>
    );
}

export function useCartWishlist() {
    const context = useContext(CartWishlistContext);
    if (!context) {
        throw new Error("useCartWishlist must be used within CartWishlistProvider");
    }
    return context;
}
