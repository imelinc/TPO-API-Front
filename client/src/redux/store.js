import { configureStore } from '@reduxjs/toolkit';
import errorMiddleware from './middleware/errorMiddleware';

/**
 * Store de Redux - Configuración centralizada del estado de la aplicación
 * 
 * Esta es la configuración inicial. Los reducers se agregarán a medida que
 * se creen los slices correspondientes.
 */
export const store = configureStore({
    reducer: {
        // Los reducers se agregarán aquí a medida que se creen los slices
        // auth: authReducer,
        // products: productsReducer,
        // cart: cartReducer,
        // wishlist: wishlistReducer,
        // orders: ordersReducer,
        // categorias: categoriasReducer,
        // descuentos: descuentosReducer,
        // usuarios: usuariosReducer,
        // vendedor: vendedorReducer,
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

