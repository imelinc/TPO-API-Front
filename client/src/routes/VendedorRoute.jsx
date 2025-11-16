import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VendedorRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        const back = location.pathname + location.search;
        return <Navigate to={`/login?redirect=${encodeURIComponent(back)}`} replace />;
    }

    if (user.rol !== "VENDEDOR") {
        return <Navigate to="/" replace />;
    }

    return children;
}
