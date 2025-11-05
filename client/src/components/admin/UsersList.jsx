import { useEffect } from "react";
// Redux imports
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/slices/authSlice";
import {
    fetchUsuarios,
    promoteUser,
    demoteUser,
    selectUsuarios,
    selectUsuariosLoading,
    selectUsuariosError,
    selectUsuariosPagination,
    selectUsuariosActionSuccess,
    clearActionSuccess,
} from "../../redux/slices/usuariosSlice";
import StatusMessage from "../common/StatusMessage";

export default function UsersList() {
    const dispatch = useAppDispatch();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const usuarios = useAppSelector(selectUsuarios);
    const loading = useAppSelector(selectUsuariosLoading);
    const error = useAppSelector(selectUsuariosError);
    const pagination = useAppSelector(selectUsuariosPagination);
    const actionSuccess = useAppSelector(selectUsuariosActionSuccess);

    useEffect(() => {
        if (user?.token) {
            dispatch(fetchUsuarios({ page: 0, size: 20 }));
        }
    }, [user, dispatch]);

    // Auto-ocultar mensajes de éxito/error
    useEffect(() => {
        if (actionSuccess) {
            setTimeout(() => {
                dispatch(clearActionSuccess());
                dispatch(fetchUsuarios({ page: pagination.page, size: 20 }));
            }, 2000);
        }
    }, [actionSuccess, dispatch, pagination.page]);

    const handlePromover = async (usuario) => {
        if (!window.confirm(`¿Promover a ${usuario.username} a ADMIN?`)) return;
        dispatch(promoteUser(usuario.id));
    };

    const handleDegradar = async (usuario) => {
        if (!window.confirm(`¿Degradar a ${usuario.username} a VENDEDOR?`)) return;
        dispatch(demoteUser(usuario.id));
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
            {error && (
                <StatusMessage
                    type="error"
                    message={error}
                    onClose={() => {}}
                />
            )}
            {actionSuccess && (
                <StatusMessage
                    type="success"
                    message={actionSuccess}
                    onClose={() => dispatch(clearActionSuccess())}
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
                        onClick={() => dispatch(fetchUsuarios({ page: pagination.page - 1, size: 20 }))}
                        disabled={pagination.page === 0}
                        className="pagination-btn"
                    >
                        ← Anterior
                    </button>
                    <span className="pagination-info">
                        Página {pagination.page + 1} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => dispatch(fetchUsuarios({ page: pagination.page + 1, size: 20 }))}
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
