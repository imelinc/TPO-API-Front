import { useAuth } from '../context/AuthContext';
import { API_URL, getJSON, postJSONWithToken, patchJSON, deleteJSON } from './client';

// Hook personalizado para hacer requests autenticados
export function useAuthenticatedAPI() {
    const { user } = useAuth();
    const token = user?.token;

    const authenticatedGet = async (endpoint) => {
        if (!token) throw new Error('No hay token de autenticación');
        return getJSON(`${API_URL}${endpoint}`, token);
    };

    const authenticatedPost = async (endpoint, body) => {
        if (!token) throw new Error('No hay token de autenticación');
        return postJSONWithToken(`${API_URL}${endpoint}`, body, token);
    };

    const authenticatedPatch = async (endpoint, body) => {
        if (!token) throw new Error('No hay token de autenticación');
        return patchJSON(`${API_URL}${endpoint}`, body, token);
    };

    const authenticatedDelete = async (endpoint) => {
        if (!token) throw new Error('No hay token de autenticación');
        return deleteJSON(`${API_URL}${endpoint}`, token);
    };

    return {
        get: authenticatedGet,
        post: authenticatedPost,
        patch: authenticatedPatch,
        delete: authenticatedDelete,
        token,
        isAuthenticated: !!token
    };
}