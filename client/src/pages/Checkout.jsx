import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserId } from '../utils/userUtils';
import { doCheckout } from '../api/cart';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import '../styles/checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = user?.token;
    const usuarioId = getUserId(user);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: '',
        dni: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            // Completar la orden en el backend
            await doCheckout(token, usuarioId);
            // Redirigir a la página de éxito
            navigate('/payment-success');
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un error al procesar el pago. Por favor intenta nuevamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        navigate('/cart');
    };

    return (
        <div className="checkout-container">
            <div className="checkout-form-container">
                <h2>Información de pago</h2>
                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-group">
                        <label htmlFor="cardNumber">Número de tarjeta</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiry">Vencimiento</label>
                            <input
                                type="text"
                                id="expiry"
                                name="expiry"
                                placeholder="MM/AA"
                                value={formData.expiry}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Nombre en la tarjeta</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="NOMBRE APELLIDO"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dni">DNI</label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            placeholder="12345678"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="checkout-buttons">
                        <button
                            type="submit"
                            className="pay-button"
                            disabled={isProcessing}
                        >
                            <LockClosedIcon className="lock-icon" />
                            {isProcessing ? 'Procesando...' : 'Pagar'}
                        </button>
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;