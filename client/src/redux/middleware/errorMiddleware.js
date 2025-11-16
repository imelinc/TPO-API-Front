/**
 * Middleware para manejar errores de Redux de forma centralizada
 * Captura todas las acciones que terminan en '/rejected' y las registra
 * 
 * En producción, podrías enviar estos errores a un servicio como Sentry
 */
const errorMiddleware = (store) => (next) => (action) => {
  // Detectar acciones rechazadas (errores)
  if (action.type && action.type.endsWith('/rejected')) {
    // Log del error en consola para desarrollo
    console.error('❌ Redux Error:', {
      type: action.type,
      payload: action.payload,
      error: action.error,
    });

    // Aquí podrías agregar lógica adicional como:
    // - Enviar a Sentry: Sentry.captureException(action.payload)
    // - Mostrar notificaciones toast
    // - Tracking de analytics
  }

  // Continuar con el siguiente middleware
  return next(action);
};

export default errorMiddleware;

