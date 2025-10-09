import { useAuth } from "../context/AuthContext";
import StatusMessage from "../components/common/StatusMessage";

export default function Orders() {
    const { user } = useAuth();

    if (!user) {
        return (
            <StatusMessage
                type="error"
                title="Acceso Denegado"
                message="Debes iniciar sesión para ver tus órdenes"
                linkTo="/login"
                linkText="Iniciar Sesión"
            />
        );
    }

    if (user.rol !== "COMPRADOR" && user.rol !== "ADMIN") {
        return (
            <StatusMessage
                type="error"
                title="Acceso Denegado"
                message="Solo los compradores pueden ver sus órdenes"
                linkTo="/"
                linkText="Volver al Inicio"
            />
        );
    }

    return (
        <div className="orders-page container">
            <h2>Mis Órdenes</h2>
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#64748b'
            }}>
                <p>Esta página estará disponible próximamente.</p>
                <p>Aquí podrás ver el historial de todas tus compras.</p>
            </div>
        </div>
    );
}