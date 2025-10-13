import { API_URL, getJSON, postJSONWithToken } from './client';

// Obtener todas las categorías (para el dropdown) 
export async function getAllCategorias(token) {
    const url = `${API_URL}/categorias`;

    // Si hay token, usar autenticación
    if (token) {
        return getJSON(url, token);
    }

    // Si no hay token, intentar acceso público
    try {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }

    throw new Error('No se pueden cargar las categorías');
}

// Crear nueva categoría
export async function createCategoria(token, categoria) {
    const url = `${API_URL}/categorias`;
    return postJSONWithToken(url, categoria, token);
}

// Eliminar categoría
export async function deleteCategoria(token, id) {
    const url = `${API_URL}/categorias/${id}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.text().catch(() => 'Error desconocido');
        throw new Error(`HTTP ${res.status}: ${error}`);
    }

    // DELETE devuelve 204 No Content sin body
    return;
}