import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getVendedorProductos, deleteProducto } from '../../api/vendedor';
import { getUsuarioById } from '../../api/usuarios';
import StatusMessage from '../common/StatusMessage';
import '../../styles/productList.css';

export default function ProductList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [productos, setProductos] = useState([]);
    const [vendedores, setVendedores] = useState({}); // Cache de vendedores {id: {nombre, apellido}}
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
            // El backend devuelve directamente un array de ProductoDTO
            const productosArray = Array.isArray(data) ? data : [];
            setProductos(productosArray);

            // Si es ADMIN, cargar información de los vendedores
            if (user?.rol === "ADMIN") {
                await loadVendedores(productosArray);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al cargar los productos' });
        } finally {
            setLoading(false);
        }
    };

    const loadVendedores = async (productosArray) => {
        try {
            // Obtener IDs únicos de vendedores
            const vendedorIds = [...new Set(productosArray.map(p => p.vendedorId).filter(Boolean))];

            // Cargar información de cada vendedor
            const vendedoresData = {};
            await Promise.all(
                vendedorIds.map(async (vendedorId) => {
                    try {
                        const vendedor = await getUsuarioById(user?.token, vendedorId);
                        vendedoresData[vendedorId] = {
                            nombre: vendedor.nombre,
                            apellido: vendedor.apellido
                        };
                    } catch (error) {
                        console.error(`Error al cargar vendedor ${vendedorId}:`, error);
                        vendedoresData[vendedorId] = {
                            nombre: 'Vendedor',
                            apellido: `#${vendedorId}`
                        };
                    }
                })
            );

            setVendedores(vendedoresData);
        } catch (error) {
            console.error('Error al cargar vendedores:', error);
        }
    };

    const handleEdit = (productoId) => {
        // Determinar la ruta según el rol del usuario
        const editPath = user?.rol === "ADMIN"
            ? `/admin/producto/editar/${productoId}`
            : `/dashboard/producto/editar/${productoId}`;
        navigate(editPath);
    };

    const handleDelete = async (productoId) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
            return;
        }

        try {
            await deleteProducto(user?.token, productoId);
            // Remover el producto de la lista local y mostrar mensaje de éxito
            setProductos(prev => prev.filter(p => p.id !== productoId));
            setMessage({ type: 'success', text: 'Producto eliminado correctamente' });
            // Auto-ocultar mensaje después de 3 segundos
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar el producto' });
            // Auto-ocultar mensaje de error después de 5 segundos
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
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
                <StatusMessage
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage({ type: '', text: '' })}
                />
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

                                {/* Mostrar vendedor solo si es ADMIN */}
                                {user?.rol === "ADMIN" && producto.vendedorId && vendedores[producto.vendedorId] && (
                                    <div className="product-vendor">
                                        <span className="vendor-badge">
                                            Vendedor: {vendedores[producto.vendedorId].nombre} {vendedores[producto.vendedorId].apellido}
                                        </span>
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