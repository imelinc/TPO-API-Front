import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        const back = location.pathname + location.search;
        return <Navigate to={`/login?redirect=${encodeURIComponent(back)}`} replace />;
    }

    if (user.rol !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
}
