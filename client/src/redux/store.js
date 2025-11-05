import { configureStore } from '@reduxjs/toolkit';
import errorMiddleware from './middleware/errorMiddleware';

// Importar reducers
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import ordersReducer from './slices/ordersSlice';

/**
 * Store de Redux - Configuración centralizada del estado de la aplicación
 * 
 * Reducers activos:
 * - auth: Autenticación (login, register, logout)
 * - products: Productos (lista, búsqueda, detalle)
 * - cart: Carrito de compras (CRUD completo + checkout)
 * - wishlist: Lista de deseos (CRUD completo + mover al carrito)
 * - orders: Órdenes (lista, detalles, historial)
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: ordersReducer,
        // categorias: categoriasReducer,     // TODO: Para futuras funcionalidades
        // descuentos: descuentosReducer,     // TODO: Para futuras funcionalidades
        // usuarios: usuariosReducer,         // TODO: Para futuras funcionalidades
        // vendedor: vendedorReducer,         // TODO: Para futuras funcionalidades
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignorar estas rutas para tokens, fechas y funciones
                // que pueden no ser serializables
                ignoredActions: [
                    'auth/login/fulfilled',
                    'auth/register/fulfilled',
                    'auth/setUser',
                ],
                ignoredPaths: [
                    'auth.user.token',
                    'auth.user',
                ],
            },
        }).concat(errorMiddleware),
    devTools: process.env.NODE_ENV !== 'production', // DevTools solo en desarrollo
});

export default store;

