import { AUTH, postJSON, postJSONWithToken, getJSON } from "./client";

// Datos mockeados para desarrollo
const MOCK_USERS = {
    "admin@pressplay.com": {
        id: 1,
        username: "admin",
        email: "admin@pressplay.com",
        rol: "ADMIN",
        nombre: "Admin",
        apellido: "PressPlay"
    },
    "vendedor@pressplay.com": {
        id: 2,
        username: "vendedor",
        email: "vendedor@pressplay.com",
        rol: "VENDEDOR",
        nombre: "Juan",
        apellido: "Vendedor"
    },
    "comprador@pressplay.com": {
        id: 3,
        username: "comprador",
        email: "comprador@pressplay.com",
        rol: "COMPRADOR",
        nombre: "María",
        apellido: "Compradora"
    }
};

const MOCK_PASSWORD = "123456"; // Contraseña para todos los usuarios mock

// Función para simular delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// Función mock para login
const mockLoginApi = async ({ email, password }) => {
    await simulateNetworkDelay();
    
    // Verificar si el email existe en los usuarios mock
    if (!MOCK_USERS[email]) {
        throw new Error("Usuario no encontrado");
    }
    
    // Verificar contraseña (en desarrollo, acepta cualquier contraseña o la mock)
    if (password !== MOCK_PASSWORD && password !== "password") {
        throw new Error("Contraseña incorrecta");
    }
    
    const user = MOCK_USERS[email];
    
    // Simular token JWT mock
    const mockToken = `mock_token_${user.id}_${Date.now()}`;
    
    return {
        access_token: mockToken,
        user: user
    };
};

// Variable para controlar si usar mock o API real
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

export const loginApi = async ({ email, password }) => {
    if (USE_MOCK) {
        return await mockLoginApi({ email, password });
    }
    return postJSON(AUTH.LOGIN, { email, password });
};

export const registerApi = (payload) => postJSON(AUTH.REGISTER, payload);
export const logoutApi = (token) => postJSONWithToken(AUTH.LOGOUT, {}, token);
export const getUserInfo = (token) => getJSON(AUTH.ME, token);
