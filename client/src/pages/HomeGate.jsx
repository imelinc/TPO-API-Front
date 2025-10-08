import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "./Home";

export default function HomeGate() {
    const { user } = useAuth();

    if (user?.rol === "VENDEDOR") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Home />;
}
