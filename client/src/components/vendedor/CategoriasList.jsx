import { useState, useEffect } from 'react';
// Redux imports
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/authSlice';
import {
    fetchCategorias,
    createNewCategoria,
    deleteExistingCategoria,
    selectCategorias,
    selectCategoriasLoading,
    selectCategoriasCreating,
    selectCategoriasError,
    selectCategoriasActionSuccess,
    clearCategoriasActionSuccess,
} from '../../redux/slices/categoriasSlice';
import StatusMessage from '../common/StatusMessage';
import '../../styles/categoriasList.css';

export default function CategoriasList() {
    const dispatch = useAppDispatch();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const categorias = useAppSelector(selectCategorias);
    const loading = useAppSelector(selectCategoriasLoading);
    const creating = useAppSelector(selectCategoriasCreating);
    const error = useAppSelector(selectCategoriasError);
    const actionSuccess = useAppSelector(selectCategoriasActionSuccess);
    
    const [showForm, setShowForm] = useState(false);
    const [newCategoriaNombre, setNewCategoriaNombre] = useState('');

    useEffect(() => {
        if (user?.token) {
            dispatch(fetchCategorias());
        }
    }, [user?.token, dispatch]);
    
    // Auto-ocultar mensaje de éxito
    useEffect(() => {
        if (actionSuccess) {
            setTimeout(() => {
                dispatch(clearCategoriasActionSuccess());
            }, 3000);
        }
    }, [actionSuccess, dispatch]);

    const handleCreateCategoria = async (e) => {
        e.preventDefault();

        if (!newCategoriaNombre.trim()) {
            return;
        }

        const result = await dispatch(createNewCategoria({
            nombre: newCategoriaNombre.trim()
        }));

        if (result.type === 'categorias/createNewCategoria/fulfilled') {
            setNewCategoriaNombre('');
            setShowForm(false);
        }
    };

    const handleCancelCreate = () => {
        setShowForm(false);
        setNewCategoriaNombre('');
    };

    const handleDelete = async (categoriaId) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            return;
        }

        dispatch(deleteExistingCategoria(categoriaId));
    };

    if (loading) {
        return <div className="loading">Cargando categorías...</div>;
    }

    return (
        <div className="categorias-container">
            <div className="categorias-header">
                <div className="categorias-title">
                    <h2>Categorías</h2>
                    <p>Gestiona las categorías de tus productos</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                    >
                        Nueva categoría
                    </button>
                )}
            </div>

            {error && (
                <StatusMessage type="error" message={error} />
            )}
            {actionSuccess && (
                <StatusMessage type="success" message={actionSuccess} />
            )}

            {showForm && (
                <div className="categoria-form-container">
                    <form onSubmit={handleCreateCategoria} className="categoria-form">
                        <div className="form-group">
                            <label htmlFor="nombreCategoria">Nombre de la categoría</label>
                            <input
                                type="text"
                                id="nombreCategoria"
                                value={newCategoriaNombre}
                                onChange={(e) => setNewCategoriaNombre(e.target.value)}
                                placeholder="Ej: Juegos de Acción"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleCancelCreate}
                                className="btn-cancel"
                                disabled={creating}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={creating}
                            >
                                {creating ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {categorias.length === 0 ? (
                <div className="empty-state">
                    <h3>No hay categorías creadas</h3>
                    <p>Crea tu primera categoría para organizar tus productos</p>
                </div>
            ) : (
                <div className="categorias-list">
                    {categorias.map(categoria => (
                        <div key={categoria.id} className="categoria-card">
                            <div className="categoria-info">
                                <h3 className="categoria-nombre">{categoria.nombre}</h3>
                            </div>
                            <button
                                onClick={() => handleDelete(categoria.id)}
                                className="categoria-delete-btn"
                                title="Eliminar categoría"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}