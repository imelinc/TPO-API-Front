import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth";
import "../styles/auth.css";

const initial = {
    username: "", email: "", password: "",
    nombre: "", apellido: "", telefono: "", direccion: "",
    rol: "",
};

export default function Register() {
    const [form, setForm] = useState(initial);
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: "", text: "" });
        setLoading(true);
        try {
            await registerApi(form);
            setMsg({ type: "success", text: "Cuenta creada. Ya podés iniciar sesión." });
            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            setMsg({ type: "error", text: err.message || "No se pudo registrar" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-wrap">
            <div className="auth-left" style={{ backgroundImage: "url(/auth/register.jpg)" }}>
                <div className="auth-left-content">
                    <h1>Getting Started</h1>
                    <p>Sumate a la tienda líder en venta de videojuegos. ¡Tu próxima aventura te espera!</p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2>Crear cuenta</h2>
                    <p className="auth-muted">Completá tus datos para registrarte.</p>

                    {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

                    <form onSubmit={onSubmit}>
                        <div className="field"><label>Username</label>
                            <input value={form.username} onChange={(e) => set("username", e.target.value)} required minLength={3} maxLength={50} /></div>
                        <div className="field"><label>Email</label>
                            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required maxLength={100} /></div>
                        <div className="field"><label>Contraseña</label>
                            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={6} maxLength={100} /></div>
                        <div className="field"><label>Nombre</label>
                            <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required minLength={2} maxLength={50} /></div>
                        <div className="field"><label>Apellido</label>
                            <input value={form.apellido} onChange={(e) => set("apellido", e.target.value)} required minLength={2} maxLength={50} /></div>
                        <div className="field"><label>Teléfono</label>
                            <input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} required minLength={8} maxLength={20} /></div>
                        <div className="field"><label>Dirección</label>
                            <input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} required minLength={5} maxLength={200} /></div>
                        <div className="field"><label>Rol</label>
                            <select value={form.rol} onChange={(e) => set("rol", e.target.value)}>
                                <option value="COMPRADOR">Comprador</option>
                                <option value="VENDEDOR">Vendedor</option>
                            </select>
                        </div>

                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Creando..." : "Registrarme"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
