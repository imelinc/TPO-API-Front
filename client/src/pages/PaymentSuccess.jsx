import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import '../styles/checkout.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { refreshCartCount } = useCartWishlist();

    useEffect(() => {
        // Refrescar el contador del carrito al montar el componente
        refreshCartCount();

        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, refreshCartCount]);

    return (
        <div className="success-container">
            <div className="success-content">
                <CheckCircleIcon className="success-icon" />
                <h2>¡Compra realizada con éxito!</h2>
            </div>
        </div>
    );
};

export default PaymentSuccess;