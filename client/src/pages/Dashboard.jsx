import { useState } from "react";
import "../styles/dashboard.css";

const TABS = [
    { key: "productos", label: "Productos" },
    { key: "categorias", label: "Categorías" },
    { key: "descuentos", label: "Descuentos" },
    { key: "imagenes", label: "Imágenes" },
];

export default function Dashboard() {
    const [tab, setTab] = useState("productos");

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
                    <EmptyState
                        title="Productos"
                        hint="Acá vas a poder crear, actualizar y eliminar productos."
                        actions={[
                            { text: "Crear producto", primary: true, disabled: true },
                            { text: "Importar desde CSV", primary: false, disabled: true },
                        ]}
                    />
                )}

                {tab === "categorias" && (
                    <EmptyState
                        title="Categorías"
                        hint="Definí y organizá las categorías de tu tienda."
                        actions={[
                            { text: "Nueva categoría", primary: true, disabled: true },
                        ]}
                    />
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

                {tab === "imagenes" && (
                    <EmptyState
                        title="Imágenes"
                        hint="Agregá imágenes a tus productos y administralas."
                        actions={[
                            { text: "Subir imágenes", primary: true, disabled: true },
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
