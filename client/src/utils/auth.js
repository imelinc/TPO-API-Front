import { useAuth } from "../context/AuthContext";

/**
 * Hook que retorna si hay un token y cuál es.
 */
export function useAuthUtils() {
    const { user } = useAuth();
    const token = user?.token || null;
    const isAuthenticated = !!token;
    return { token, isAuthenticated };
}

export function getAuthTokenFromUser(user) {
    return user?.token || null;
}
