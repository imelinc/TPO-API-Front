import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserRoute({ children }) {
    const { user } = useAuth();

    // Si no hay usuario, permitir acceso (para ver productos sin estar logueado)
    if (!user) {
        return children;
    }

    // Si es vendedor, redirigir al dashboard
    if (user.rol === "VENDEDOR") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}