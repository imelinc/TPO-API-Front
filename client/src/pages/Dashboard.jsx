import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/vendedor/ProductList";
import CategoriasList from "../components/vendedor/CategoriasList";
import "../styles/dashboard.css";

const TABS = [
    { key: "productos", label: "Productos" },
    { key: "categorias", label: "Categorías" },
    { key: "descuentos", label: "Descuentos" },
];

export default function Dashboard() {
    const [tab, setTab] = useState("productos");
    const navigate = useNavigate();

    const handleCreateProduct = () => {
        navigate('/dashboard/producto/crear');
    };

    return (
        <section className="dash-wrap">
            <header className="dash-header">
                <h1>Panel de vendedor</h1>
                <p className="dash-sub">Gestioná tu catálogo desde un solo lugar.</p>
            </header>

            <nav className="dash-tabs">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        className={`dash-tab-btn ${tab === t.key ? "is-active" : ""}`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>

            <div className="dash-panel">
                {tab === "productos" && (
                    <div className="productos-panel">
                        <div className="productos-header">
                            <div className="productos-title">
                                <h2>Productos</h2>
                                <p>Gestiona tu catálogo de productos</p>
                            </div>
                            <button
                                onClick={handleCreateProduct}
                                className="btn-primary"
                            >
                                Crear producto
                            </button>
                        </div>
                        <ProductList />
                    </div>
                )}

                {tab === "categorias" && (
                    <CategoriasList />
                )}

                {tab === "descuentos" && (
                    <EmptyState
                        title="Descuentos"
                        hint="Configurá promociones y periodos de descuentos."
                        actions={[
                            { text: "Crear descuento", primary: true, disabled: true },
                        ]}
                    />
                )}
            </div>
        </section>
    );
}

function EmptyState({ title, hint, actions = [] }) {
    return (
        <div className="dash-empty">
            <h2>{title}</h2>
            <p>{hint}</p>
            <div className="dash-empty-actions">
                {actions.map((a, i) => (
                    <button
                        key={i}
                        className={a.primary ? "btn-primary" : "btn-outline"}
                        disabled={a.disabled}
                        type="button"
                    >
                        {a.text}
                    </button>
                ))}
            </div>
        </div>
    );
}
