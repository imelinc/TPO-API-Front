import { createContext, useContext, useState } from "react";
import { logoutApi } from "../api/auth";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const logout = async () => {
        try { await logoutApi(); } catch { } // da igual si falla
        setUser(null);
    };

    return (
        <AuthCtx.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export const useAuth = () => useContext(AuthCtx);
