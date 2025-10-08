import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        return children;
    }

    if (user.rol === "VENDEDOR") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}