const API = "http://localhost:8080";

const authHeaders = (token) => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
});

// Obtener todas las órdenes de un usuario
export async function getUserOrders(token, usuarioId) {
    const res = await fetch(`${API}/ordenes/usuario/${usuarioId}`, {
        method: "GET",
        headers: authHeaders(token),
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudieron cargar las órdenes");
    }
    const data = await res.json();
    // El backend devuelve un objeto paginado con las órdenes en 'content'
    return data.content || [];
}

// Obtener detalles de un item de orden específico (si existe este endpoint)
export async function getOrderItem(token, itemId) {
    const res = await fetch(`${API}/orden-items/${itemId}`, {
        method: "GET",
        headers: authHeaders(token),
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo cargar el item de la orden");
    }
    return res.json();
}