import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getVendedorProductos, deleteProducto } from '../../api/vendedor';
import StatusMessage from '../common/StatusMessage';
import '../../styles/productList.css';

export default function ProductList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user?.token) {
            loadProductos();
        }
    }, [user?.token]);

    const loadProductos = async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            const data = await getVendedorProductos(user?.token);
            setProductos(data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al cargar los productos' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (productoId) => {
        navigate(`/dashboard/producto/editar/${productoId}`);
    };

    const handleDelete = async (productoId) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
            return;
        }

        try {
            await deleteProducto(user?.token, productoId);
            // Remover el producto de la lista local sin mostrar mensaje
            setProductos(prev => prev.filter(p => p.id !== productoId));
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar el producto' });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(price);
    };

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    return (
        <div className="product-list-container">
            {message.text && (
                <StatusMessage type={message.type} message={message.text} />
            )}

            {productos.length === 0 ? (
                <div className="empty-state">
                    <h3>No tienes productos creados</h3>
                    <p>Crea tu primer producto para comenzar a vender</p>
                </div>
            ) : (
                <div className="products-grid">
                    {productos.map(producto => (
                        <div key={producto.id} className="product-card" onClick={() => handleEdit(producto.id)}>
                            <div className="product-image">
                                {(() => {
                                    // Buscar imagen principal: puede estar en imagenUrl o ser la primera del array
                                    const imagenPrincipal = producto.imagenUrl ||
                                        (producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0].url : null);

                                    return imagenPrincipal ? (
                                        <img
                                            src={imagenPrincipal}
                                            alt={producto.titulo}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null;
                                })()}
                                <div className="product-image-placeholder" style={{
                                    display: (producto.imagenUrl || (producto.imagenes && producto.imagenes.length > 0)) ? 'none' : 'flex'
                                }}>
                                    📦
                                </div>
                            </div>

                            <div className="product-info">
                                <h3 className="product-title">{producto.titulo}</h3>
                                <p className="product-description">
                                    {producto.descripcion?.length > 80
                                        ? `${producto.descripcion.substring(0, 80)}...`
                                        : producto.descripcion
                                    }
                                </p>

                                <div className="product-details">
                                    <div className="product-price">
                                        {formatPrice(producto.precio)}
                                    </div>
                                    <div className="product-stock">
                                        Stock: {producto.stock || 0}
                                    </div>
                                    <div className="product-category">
                                        {producto.categoriaNombre}
                                    </div>
                                </div>

                                {producto.imagenes && producto.imagenes.length > 1 && (
                                    <div className="product-images-count">
                                        📷 {producto.imagenes.length} imágenes
                                    </div>
                                )}
                            </div>

                            <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => handleEdit(producto.id)}
                                    className="btn-edit"
                                    title="Editar producto"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(producto.id)}
                                    className="btn-delete"
                                    title="Eliminar producto"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}