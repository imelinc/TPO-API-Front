import { useState, useEffect } from "react";
import { getAllUsuarios, promoverUsuario, degradarUsuario } from "../../api/usuarios";
import { useAuth } from "../../context/AuthContext";
import StatusMessage from "../common/StatusMessage";

export default function UsersList() {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        totalPages: 0,
        totalElements: 0
    });

    const fetchUsuarios = async (page = 0) => {
        try {
            setLoading(true);
            const data = await getAllUsuarios(user.token, page, 20);
            setUsuarios(data.content || []);
            setPagination({
                page: data.number,
                totalPages: data.totalPages,
                totalElements: data.totalElements
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Error al cargar usuarios"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchUsuarios();
        }
    }, [user]);

    const handlePromover = async (usuario) => {
        if (!window.confirm(`¿Promover a ${usuario.username} a ADMIN?`)) return;

        try {
            await promoverUsuario(user.token, usuario.id);
            setMessage({
                type: "success",
                text: `${usuario.username} ha sido promovido a ADMIN`
            });
            // Auto-ocultar mensaje después de 2 segundos
            setTimeout(() => setMessage(null), 2000);
            fetchUsuarios(pagination.page); // Recargar la página actual
        } catch (error) {
            const errorMsg = error.message || "Error al promover usuario";
            setMessage({ type: "error", text: errorMsg });
            // Auto-ocultar mensaje de error después de 2 segundos
            setTimeout(() => setMessage(null), 2000);
        }
    };

    const handleDegradar = async (usuario) => {
        if (!window.confirm(`¿Degradar a ${usuario.username} a VENDEDOR?`)) return;

        try {
            await degradarUsuario(user.token, usuario.id);
            setMessage({
                type: "success",
                text: `${usuario.username} ha sido degradado a VENDEDOR`
            });
            // Auto-ocultar mensaje después de 2 segundos
            setTimeout(() => setMessage(null), 2000);
            fetchUsuarios(pagination.page);
        } catch (error) {
            const errorMsg = error.message || "Error al degradar usuario";
            setMessage({ type: "error", text: errorMsg });
            // Auto-ocultar mensaje de error después de 2 segundos
            setTimeout(() => setMessage(null), 2000);
        }
    };

    const getRolBadgeClass = (rol) => {
        switch (rol) {
            case "ADMIN": return "rol-badge rol-admin";
            case "VENDEDOR": return "rol-badge rol-vendedor";
            case "COMPRADOR": return "rol-badge rol-comprador";
            default: return "rol-badge";
        }
    };

    if (loading) {
        return <div className="loading-state">Cargando usuarios...</div>;
    }

    return (
        <div className="users-list-container">
            {message && (
                <StatusMessage
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            <div className="users-stats">
                <p>Total de usuarios: <strong>{pagination.totalElements}</strong></p>
            </div>

            <div className="users-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td className="username-cell">{usuario.username}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.telefono}</td>
                                <td className="direccion-cell">{usuario.direccion}</td>
                                <td>
                                    <span className={getRolBadgeClass(usuario.rol)}>
                                        {usuario.rol}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    {usuario.rol === "VENDEDOR" && (
                                        <button
                                            onClick={() => handlePromover(usuario)}
                                            className="btn-action btn-promote"
                                            title="Promover a ADMIN"
                                        >
                                            Promover
                                        </button>
                                    )}
                                    {usuario.rol === "ADMIN" && (
                                        <button
                                            onClick={() => handleDegradar(usuario)}
                                            className="btn-action btn-demote"
                                            title={usuario.id === 1 ? "No se puede degradar al administrador principal" : "Degradar a VENDEDOR"}
                                            disabled={usuario.id === 1}
                                        >
                                            Degradar
                                        </button>
                                    )}
                                    {usuario.rol === "COMPRADOR" && (
                                        <span className="no-action">Sin acciones</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => fetchUsuarios(pagination.page - 1)}
                        disabled={pagination.page === 0}
                        className="pagination-btn"
                    >
                        ← Anterior
                    </button>
                    <span className="pagination-info">
                        Página {pagination.page + 1} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => fetchUsuarios(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className="pagination-btn"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}
