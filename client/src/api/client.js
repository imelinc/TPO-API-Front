export const API_URL = "http://localhost:8080"; // el back esta en este puerto

export const AUTH = {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    LOGOUT: `${API_URL}/auth/logout`,
    ME: `${API_URL}/auth/me`,
};

export async function postJSON(url, body) {
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
    });
    // Por si el back devuelve 204 sin body
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Error en la solicitud");
    return data;
}

export async function getJSON(url, token) {
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Error en la solicitud");
    return data;
}
