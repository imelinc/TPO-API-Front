import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProducto, updateProducto, getProducto, addImagenToProducto, deleteImagenFromProducto } from '../api/vendedor';
import { getAllCategorias } from '../api/categorias';
import StatusMessage from '../components/common/StatusMessage';
import '../styles/productForm.css';

export default function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // Si hay ID, es edición; si no, es creación
    const { user } = useAuth();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoriaId: '',
        imagenUrl: '', // URL principal
        imagenes: [] // URLs adicionales
    });

    const [imageUrls, setImageUrls] = useState(['']); // Array para manejar múltiples URLs

    useEffect(() => {
        loadCategorias();
        if (isEdit && user?.token) {
            loadProducto();
        }
    }, [id, user?.token]);

    const loadCategorias = async () => {
        try {
            console.log('Token disponible:', !!user?.token);
            console.log('Cargando categorías...');
            const data = await getAllCategorias(user?.token);
            console.log('Categorías cargadas:', data);
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            setMessage({ type: 'error', text: `Error al cargar categorías: ${error.message}` });
        }
    };

    const loadProducto = async () => {
        try {
            setLoading(true);
            const producto = await getProducto(user?.token, id);
            setFormData({
                titulo: producto.titulo || '',
                descripcion: producto.descripcion || '',
                precio: producto.precio?.toString() || '',
                stock: producto.stock?.toString() || '',
                categoriaId: producto.categoriaId?.toString() || '',
                imagenUrl: producto.imagenUrl || '',
                imagenes: producto.imagenes || []
            });

            // Cargar URLs de imágenes: principal primero, luego adicionales
            const urls = [];

            // Agregar imagen principal si existe
            if (producto.imagenUrl) {
                urls.push(producto.imagenUrl);
            }

            // Agregar imágenes adicionales (filtrar la principal si está duplicada)
            if (producto.imagenes && producto.imagenes.length > 0) {
                producto.imagenes.forEach(img => {
                    if (img.url && img.url !== producto.imagenUrl) {
                        urls.push(img.url);
                    }
                });
            }

            // Asegurar que siempre haya al menos un campo
            if (urls.length === 0) urls.push('');

            setImageUrls(urls);

        } catch (error) {
            setMessage({ type: 'error', text: 'Error al cargar el producto' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrlField = () => {
        setImageUrls([...imageUrls, '']);
    };

    const removeImageUrlField = (index) => {
        if (imageUrls.length > 1) {
            const newUrls = imageUrls.filter((_, i) => i !== index);
            setImageUrls(newUrls);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo.trim() || !formData.precio || !formData.categoriaId) {
            setMessage({ type: 'error', text: 'Por favor complete todos los campos obligatorios' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const productData = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock) || 0,
                categoriaId: parseInt(formData.categoriaId),
                imagenUrl: imageUrls[0] || '' // Primera URL como imagen principal
            };

            let producto;
            if (isEdit) {
                producto = await updateProducto(user?.token, id, productData);
                setMessage({ type: 'success', text: 'Producto actualizado correctamente' });
            } else {
                producto = await createProducto(user?.token, productData);
                setMessage({ type: 'success', text: 'Producto creado correctamente' });
            }

            // Manejar imágenes adicionales
            if (producto.id && imageUrls.length > 1) {
                for (let i = 1; i < imageUrls.length; i++) {
                    const url = imageUrls[i].trim();
                    if (url) {
                        try {
                            await addImagenToProducto(user?.token, producto.id, url);
                        } catch (imgError) {
                            console.warn('Error al agregar imagen:', imgError);
                        }
                    }
                }
            }

            // Redirigir después de un breve delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            setMessage({
                type: 'error',
                text: isEdit ? 'Error al actualizar el producto' : 'Error al crear el producto'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    if (loading && isEdit) {
        return <div className="loading">Cargando producto...</div>;
    }

    return (
        <div className="product-form-container">
            <div className="product-form-header">
                <h1>{isEdit ? 'Editar Producto' : 'Crear Producto'}</h1>
                <p>Complete los datos del producto</p>
            </div>

            {message.text && (
                <StatusMessage type={message.type} message={message.text} />
            )}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="titulo">Título *</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        required
                        placeholder="Nombre del producto"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Descripción del producto"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="precio">Precio *</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="categoriaId">Categoría *</label>
                    <select
                        id="categoriaId"
                        name="categoriaId"
                        value={formData.categoriaId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Imágenes del Producto</label>
                    <div className="image-urls-container">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="image-url-row">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                    placeholder={index === 0 ? "URL de imagen principal" : "URL de imagen adicional"}
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageUrlField(index)}
                                        className="btn-remove-image"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageUrlField}
                            className="btn-add-image"
                        >
                            + Añadir otra imagen
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </div>
    );
}