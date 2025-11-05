import { useState, useEffect } from 'react';
// Redux imports
import { useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/authSlice';
import { getAllCategorias, createCategoria, deleteCategoria } from '../../api/categorias';
import StatusMessage from '../common/StatusMessage';
import '../../styles/categoriasList.css';

export default function CategoriasList() {
    const user = useAppSelector(selectUser);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showForm, setShowForm] = useState(false);
    const [newCategoriaNombre, setNewCategoriaNombre] = useState('');
    const [creatingCategoria, setCreatingCategoria] = useState(false);

    useEffect(() => {
        if (user?.token) {
            loadCategorias();
        }
    }, [user?.token]);

    const loadCategorias = async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            const data = await getAllCategorias(user?.token);
            setCategorias(data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al cargar las categorías' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategoria = async (e) => {
        e.preventDefault();

        if (!newCategoriaNombre.trim()) {
            setMessage({ type: 'error', text: 'El nombre de la categoría es obligatorio' });
            return;
        }

        try {
            setCreatingCategoria(true);
            setMessage({ type: '', text: '' });

            const nuevaCategoria = await createCategoria(user?.token, {
                nombre: newCategoriaNombre.trim()
            });

            // Agregar la nueva categoría a la lista
            setCategorias(prev => [...prev, nuevaCategoria]);
            setNewCategoriaNombre('');
            setShowForm(false);
            setMessage({ type: 'success', text: 'Categoría creada correctamente' });

            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

        } catch (error) {
            setMessage({ type: 'error', text: 'Error al crear la categoría' });
        } finally {
            setCreatingCategoria(false);
        }
    };

    const handleCancelCreate = () => {
        setShowForm(false);
        setNewCategoriaNombre('');
        setMessage({ type: '', text: '' });
    };

    const handleDelete = async (categoriaId) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            return;
        }

        try {
            await deleteCategoria(user?.token, categoriaId);
            // Remover la categoría de la lista local sin mostrar mensaje
            setCategorias(prev => prev.filter(c => c.id !== categoriaId));
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar la categoría' });
        }
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

            {message.text && (
                <StatusMessage type={message.type} message={message.text} />
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
                                disabled={creatingCategoria}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={creatingCategoria}
                            >
                                {creatingCategoria ? 'Creando...' : 'Crear'}
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