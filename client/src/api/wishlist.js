const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

const authHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

// -------- Wishlist --------
export async function createWishlistIfMissing(token, usuarioId) {
    try {
        // Intentar con el backend primero
        const getRes = await fetch(`${API}/wishlists/usuario/${usuarioId}`, {
            headers: authHeaders(token),
        });

        if (getRes.ok) {
            return await getRes.json();
        }

        if (getRes.status === 404) {
            const createRes = await fetch(`${API}/wishlists/usuario/${usuarioId}`, {
                method: "POST",
                headers: authHeaders(token),
            });

            if (createRes.ok) {
                return await createRes.json();
            }
        }
    } catch (error) {
        console.error("Error al crear/obtener wishlist:", error.message);
    }

    // Retornar wishlist vacía si hay error
    return { items: [] };
}

export async function getWishlist(token, usuarioId) {
    try {
        // Intentar con el backend
        const res = await fetch(`${API}/wishlists/usuario/${usuarioId}`, {
            headers: authHeaders(token),
        });

        if (res.ok) {
            return await res.json();
        }

        if (res.status === 404) {
            // Backend existe pero no hay wishlist, retornar vacía
            return { items: [] };
        }
    } catch (error) {
        console.error("Error al obtener wishlist:", error.message);
    }

    // Retornar wishlist vacía si hay error
    return { items: [] };
}

export async function clearWishlist(token, usuarioId) {
    try {
        const res = await fetch(`${API}/wishlists/usuario/${usuarioId}/vaciar`, {
            method: "DELETE",
            headers: authHeaders(token),
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Error al vaciar wishlist:", error.message);
    }

    // Retornar wishlist vacía si hay error
    return { items: [] };
}

// -------- Items --------
export async function addItemToWishlist(token, usuarioId, productoId, productoTitulo) {
    try {
        // Agregar al backend
        const res = await fetch(`${API}/wishlists/usuario/${usuarioId}/items`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify({ productoId, productoTitulo }),
        });

        if (res.ok) {
            return await res.json();
        }

        // Si hay error del servidor, lanzar excepción
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor' }));
        throw new Error(errorData.message || 'Error al agregar a wishlist');
    } catch (error) {
        console.error("Error al agregar item a wishlist:", error.message);
        throw error;
    }
}

export async function removeWishlistItem(token, usuarioId, productoId) {
    try {
        const res = await fetch(
            `${API}/wishlists/usuario/${usuarioId}/items/${productoId}`,
            { method: "DELETE", headers: authHeaders(token) }
        );
        if (res.ok) {
            return await res.json();
        }

        // Si hay error del servidor, lanzar excepción
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor' }));
        throw new Error(errorData.message || 'Error al eliminar de wishlist');
    } catch (error) {
        console.error("Error al eliminar item de wishlist:", error.message);
        throw error;
    }
}

// -------- Agregar todos al carrito --------
export async function addAllToCart(token, usuarioId) {
    try {
        const res = await fetch(`${API}/wishlists/usuario/${usuarioId}/agregar-al-carrito`, {
            method: "POST",
            headers: authHeaders(token),
        });
        if (res.ok) {
            return await res.json();
        }

        // Si hay error del servidor, lanzar excepción
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor' }));
        throw new Error(errorData.message || 'Error al agregar todos al carrito');
    } catch (error) {
        console.error("Error al agregar todos al carrito:", error.message);
        throw error;
    }
}
