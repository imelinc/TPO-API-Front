const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

const authHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

// -------- LocalStorage Helper (Fallback) --------
const WISHLIST_KEY_PREFIX = "wishlist_";

function getWishlistKey(usuarioId) {
    return `${WISHLIST_KEY_PREFIX}${usuarioId}`;
}

function getLocalWishlist(usuarioId) {
    try {
        const data = localStorage.getItem(getWishlistKey(usuarioId));
        if (!data) return { items: [] };
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer wishlist local:", error);
        return { items: [] };
    }
}

function saveLocalWishlist(usuarioId, wishlist) {
    try {
        localStorage.setItem(getWishlistKey(usuarioId), JSON.stringify(wishlist));
    } catch (error) {
        console.error("Error al guardar wishlist local:", error);
    }
}

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
        console.log("Backend no disponible, usando localStorage:", error.message);
    }

    // Fallback a localStorage
    return getLocalWishlist(usuarioId);
}

export async function getWishlist(token, usuarioId) {
    try {
        // Intentar con el backend primero
        const res = await fetch(`${API}/wishlists/usuario/${usuarioId}`, {
            headers: authHeaders(token),
        });

        if (res.ok) {
            return await res.json();
        }

        if (res.status === 404) {
            // Backend existe pero no hay wishlist, usar localStorage
            return getLocalWishlist(usuarioId);
        }
    } catch (error) {
        console.log("Backend no disponible, usando localStorage:", error.message);
    }

    // Fallback a localStorage
    return getLocalWishlist(usuarioId);
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
        console.log("Backend no disponible, usando localStorage:", error.message);
    }

    // Fallback a localStorage
    const emptyWishlist = { items: [] };
    saveLocalWishlist(usuarioId, emptyWishlist);
    return emptyWishlist;
}

// -------- Items --------
export async function addItemToWishlist(token, usuarioId, productoId) {
    try {
        // Intentar con el backend primero
        const res = await fetch(`${API}/wishlists/usuario/${usuarioId}/items`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify({ productoId }),
        });

        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.log("Backend no disponible, usando localStorage:", error.message);
    }

    // Fallback a localStorage
    const wishlist = getLocalWishlist(usuarioId);

    // Verificar si el producto ya está en la wishlist
    const exists = wishlist.items.some(item => item.productoId === productoId);
    if (exists) {
        throw new Error("El producto ya está en tu wishlist");
    }

    // Agregar el nuevo item (sin título por ahora, se enriquecerá en la página)
    wishlist.items.push({
        productoId,
        productoTitulo: `Producto ${productoId}` // Placeholder
    });

    saveLocalWishlist(usuarioId, wishlist);
    return wishlist;
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
    } catch (error) {
        console.log("Backend no disponible, usando localStorage:", error.message);
    }

    // Fallback a localStorage
    const wishlist = getLocalWishlist(usuarioId);
    wishlist.items = wishlist.items.filter(item => item.productoId !== productoId);
    saveLocalWishlist(usuarioId, wishlist);
    return wishlist;
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
    } catch (error) {
        console.log("Backend no disponible para agregar al carrito directamente:", error.message);
    }

    // Fallback: devolver la wishlist para que el frontend maneje agregar al carrito
    // La página tendrá que agregar cada item manualmente
    return getLocalWishlist(usuarioId);
}
