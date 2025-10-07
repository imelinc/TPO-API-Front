import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Login() {
    const { setUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: "", text: "" });
        setLoading(true);
        try {
            const data = await loginApi({ email, password });
            setUser({ username: data.username, email: data.email, rol: data.rol });
            setMsg({ type: "success", text: "Inicio de sesión exitoso. Redirigiendo..." });
            setTimeout(() => navigate("/"), 900);
        } catch (err) {
            setMsg({ type: "error", text: err.message || "Credenciales inválidas" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-wrap">
            <div className="auth-left" style={{ backgroundImage: "url(/auth/login.jpg)" }}>
                <div className="auth-left-content">
                    <h1>Welcome back!</h1>
                    <p>Iniciá sesión y seguí jugando donde lo dejaste.</p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2>Iniciá Sesión</h2>
                    <p className="auth-muted">Accedé con tu cuenta de PressPlay.</p>

                    {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

                    <form onSubmit={onSubmit}>
                        <div className="field">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="tuemail@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Ingresando..." : "Sign In"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        ¿Nuevo por acá? <Link to="/register">Crear una cuenta</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
