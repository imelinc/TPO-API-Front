import { API_URL, getJSON, postJSONWithToken } from './client';

// Obtener todas las categorías (para el dropdown) 
export async function getAllCategorias(token) {
    const url = `${API_URL}/categorias`;

    // Primero intento sin token para ver si es público
    try {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        }
    } catch (error) {
        console.warn('Endpoint público falló, intentando con token:', error);
    }

    // Si falla sin token, intento con token
    if (token) {
        return getJSON(url, token);
    }

    throw new Error('No se pueden cargar las categorías');
}

// Crear nueva categoría
export async function createCategoria(token, categoria) {
    const url = `${API_URL}/categorias`;
    return postJSONWithToken(url, categoria, token);
}