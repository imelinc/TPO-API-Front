const API_URL = "http://localhost:8080";

const authHeaders = (token) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
});

/**
 * Obtener todos los usuarios (solo ADMIN)
 * GET /usuarios
 */
export async function getAllUsuarios(token, page = 0, size = 20) {
    try {
        const response = await fetch(`${API_URL}/usuarios?page=${page}&size=${size}`, {
            method: "GET",
            headers: authHeaders(token),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener usuarios");
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
}

/**
 * Promover un usuario VENDEDOR a ADMIN
 * PATCH /admin/promover/{usuarioId}
 */
export async function promoverUsuario(token, usuarioId) {
    try {
        const response = await fetch(`${API_URL}/admin/promover/${usuarioId}`, {
            method: "PATCH",
            headers: authHeaders(token),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al promover usuario");
        }

        return await response.json();
    } catch (error) {
        console.error('Error al promover usuario:', error);
        throw error;
    }
}

/**
 * Degradar un usuario ADMIN a VENDEDOR
 * PATCH /admin/degradar/{usuarioId}
 */
export async function degradarUsuario(token, usuarioId) {
    try {
        const response = await fetch(`${API_URL}/admin/degradar/${usuarioId}`, {
            method: "PATCH",
            headers: authHeaders(token),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al degradar usuario");
        }

        return await response.json();
    } catch (error) {
        console.error('Error al degradar usuario:', error);
        throw error;
    }
}
