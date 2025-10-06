import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

import Logo from "../../assets/Logo-big.png";

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        const term = q.trim();
        if (!term) return;
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                {/* Izquierda: Logo + nombre */}
                <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <img src={Logo} alt="PressPlay logo" />
                    <span className="brand__name">PressPlay</span>
                </div>

                {/* Centro: buscador */}
                <div className="search">
                    <form onSubmit={onSubmit} role="search" aria-label="Buscar juegos">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Buscar juegos, géneros, ofertas..."
                            aria-label="Buscar"
                        />
                        <button type="submit" aria-label="Buscar">
                            {/* Ícono lupa (SVG inline) */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Derecha: wishlist, carrito, usuario */}
                <div className="actions">
                    <button className="iconBtn" aria-label="Wishlist" onClick={() => navigate("/wishlist")}>
                        {/* Corazón */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                                strokeWidth="2"
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                            />
                        </svg>
                        {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                    </button>

                    <button className="iconBtn" aria-label="Carrito" onClick={() => navigate("/cart")}>
                        {/* Carrito */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1" strokeWidth="2" />
                            <circle cx="20" cy="21" r="1" strokeWidth="2" />
                            <path strokeWidth="2" d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h8.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </button>

                    <button className="iconBtn" aria-label="Iniciar sesión / Registrarse" onClick={() => navigate("/auth")}>
                        {/* Usuario */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" strokeWidth="2" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
